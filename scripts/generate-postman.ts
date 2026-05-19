import * as fs from 'fs';
import * as path from 'path';

const DOCS_DIR = path.join(process.cwd(), 'ux-flow-with-api-responses');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'tbsosick.postman_collection.json');
const SOCKET_HELPER_PATH = path.join(process.cwd(), 'src', 'helpers', 'socketHelper.ts');

interface PostmanRequest {
  name: string;
  event?: any[];
  request: {
    method: string;
    header: any[];
    body?: {
      mode: string;
      raw?: string;
      formdata?: any[];
      options?: {
        raw: {
          language: string;
        };
      };
    };
    url: {
      raw: string;
      host: string[];
      path: string[];
      query?: any[];
      variable?: any[];
    };
    description?: string;
  };
  response: any[];
}

interface PostmanFolder {
  name: string;
  item: (PostmanRequest | PostmanFolder)[];
  description?: string;
}

interface PostmanCollection {
  info: {
    name: string;
    schema: string;
    description?: string;
  };
  item: PostmanFolder[];
  variable: any[];
}

function parseMarkdownFile(filePath: string): PostmanRequest[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const requests: PostmanRequest[] = [];

  // Match API sections starting with ## or ###
  // Improved regex:
  // 1. Handles both ## and ###
  // 2. Optional number (e.g. 1.1)
  // 3. Ensures no other headers are between the header and the code block
  // 4. Handles optional language tags (e.g. ```http)
  // 5. Handles CRLF and extra spaces
  const sectionRegex = /(?:##|###)\s+(?:(\d+(?:\.\d+)?)\s+)?(.*?)\r?\n+(?:(?!(?:##|###))[\s\S])*?```(?:http|)\r?\n(GET|POST|PUT|PATCH|DELETE)\s+(.*?)\r?\n([\s\S]*?)```/g;
  let match;

  while ((match = sectionRegex.exec(content)) !== null) {
    const [_, id, name, method, fullPath, headersAndAuth] = match;
    const requestName = id ? `${id} ${name.trim()}` : name.trim();
    
    // Extract description (text between the code block and "Implementation" or next section)
    const afterCodeBlock = content.substring(match.index + match[0].length);
    const descriptionMatch = afterCodeBlock.match(/^\s*> (.*?)(?:\r?\n|$)/);
    const description = descriptionMatch ? descriptionMatch[1].trim() : '';

    // Extract request body
    const bodyMatch = afterCodeBlock.match(/\*\*Request Body:\*\*\s*\r?\n```json\r?\n([\s\S]*?)```/);
    const bodyRaw = bodyMatch ? bodyMatch[1].trim() : null;

    // Parse path and query params
    const [pathPart, queryPart] = fullPath.trim().split('?');
    const pathSegments = pathPart.split('/').filter(p => p);
    
    // Handle path variables (e.g., :cardId)
    const variables: any[] = [];
    const formattedPathSegments = pathSegments.map(segment => {
      if (segment.startsWith(':')) {
        const key = segment.substring(1);
        variables.push({ key, value: '' });
        return `:${key}`;
      }
      return segment;
    });

    const queryParams: any[] = [];
    if (queryPart) {
      queryPart.split('&').forEach(param => {
        const [key, value] = param.split('=');
        queryParams.push({ key, value: value || '' });
      });
    }

    const request: PostmanRequest = {
      name: requestName,
      request: {
        method,
        header: [
          {
            key: 'Content-Type',
            value: 'application/json',
            type: 'text'
          }
        ],
        url: {
          raw: `{{baseUrl}}${fullPath.trim()}`,
          host: ['{{baseUrl}}'],
          path: formattedPathSegments,
          query: queryParams.length > 0 ? queryParams : undefined,
          variable: variables.length > 0 ? variables : undefined
        },
        description: description
      },
      response: []
    };

    // Handle Auth header
    if (headersAndAuth.includes('Auth: Bearer') || headersAndAuth.includes('Authorization: Bearer')) {
      request.request.header.push({
        key: 'Authorization',
        value: 'Bearer {{accessToken}}',
        type: 'text'
      });
    }

    // Add Postman Script for Login and Token Refresh to store accessToken
    if (fullPath.includes('/login') || fullPath.includes('/verify-otp') || fullPath.includes('/refresh-token')) {
      request.event = [
        {
          listen: "test",
          script: {
            exec: [
              "const response = pm.response.json();",
              "if (response.success && response.data && response.data.accessToken) {",
              "    pm.collectionVariables.set(\"accessToken\", response.data.accessToken);",
              "    console.log(\"accessToken has been set in collection variables\");",
              "}",
              "if (response.success && response.data && response.data.refreshToken) {",
              "    pm.collectionVariables.set(\"refreshToken\", response.data.refreshToken);",
              "}"
            ],
            type: "text/javascript"
          }
        }
      ];
    }

    // Handle request body (JSON or Form Data)
    if (bodyRaw) {
      request.request.body = {
        mode: 'raw',
        raw: bodyRaw,
        options: {
          raw: {
            language: 'json'
          }
        }
      };
    } else {
      // Check if there's a Form Data table in the markdown
      const afterCodeBlock = content.substring(match.index + match[0].length);
      const formDataTableRegex = /\| Field \| Type \| Required \| Description \|\r?\n\| :--- \| :--- \| :---: \| :--- \|\r?\n([\s\S]*?)(?:\r?\n\r?\n|$)/;
      const formDataMatch = afterCodeBlock.match(formDataTableRegex);

      if (formDataMatch) {
        const rows = formDataMatch[1].trim().split('\n');
        const formData: any[] = [];

        rows.forEach(row => {
          const cols = row.split('|').filter(c => c.trim()).map(c => c.trim());
          if (cols.length >= 2) {
            const field = cols[0].replace(/`/g, '');
            const type = cols[1].toLowerCase();
            const isFile = type.includes('file');

            formData.push({
              key: field,
              value: isFile ? '' : '',
              type: isFile ? 'file' : 'text',
              src: isFile ? [] : undefined,
              description: cols[3] || ''
            });
          }
        });

        if (formData.length > 0) {
          request.request.body = {
            mode: 'formdata',
            formdata: formData
          };
          // Remove application/json header if using formdata
          request.request.header = request.request.header.filter(h => h.key !== 'Content-Type');
        }
      }
    }

    requests.push(request);
  }

  return requests;
}

function getSocketEventsDocs(): string {
  if (!fs.existsSync(SOCKET_HELPER_PATH)) return "Socket helper not found.";

  const content = fs.readFileSync(SOCKET_HELPER_PATH, 'utf-8');
  const events: { name: string; type: 'ON' | 'EMIT'; payload?: string }[] = [];

  // Simple regex to find events
  const onRegex = /socket\.on\(\s*['"](.*?)['"]\s*,\s*async\s*\((.*?)\)/g;
  const emitRegex = /io\.to\(.*?\)\.emit\(\s*['"](.*?)['"]\s*,\s*\{(.*?)\}/g;

  let match;
  while ((match = onRegex.exec(content)) !== null) {
    events.push({ name: match[1], type: 'ON', payload: match[2].trim() });
  }
  while ((match = emitRegex.exec(content)) !== null) {
    events.push({ name: match[1], type: 'EMIT', payload: match[2].trim() });
  }

  // Deduplicate and format
  const uniqueEvents = events.filter((v, i, a) => a.findIndex(t => t.name === v.name && t.type === v.type) === i);

  let doc = "### 🔌 Socket.IO Events Inventory & Guide\n\n";
  doc += "Jokhon apni Socket test korben, nicher table-ti follow koren bujhar jonno je konta apnake pathate hobe (Emit) ar konta server pathabe (Listen).\n\n";
  doc += "| Event Name | Action Type | Direction | Payload Example | Step-by-Step Testing |\n";
  doc += "|------------|-------------|-----------|-----------------|----------------------|\n";

  uniqueEvents.forEach(e => {
    const actionType = e.type === 'ON' ? "**EMITTING** (Send)" : "**LISTENING** (Receive)";
    const direction = e.type === 'ON' ? "📥 Client -> Server" : "📤 Server -> Client";
    let payloadExample = "N/A";
    let testInstruction = "";
    
    if (e.name === 'JOIN_CHAT') {
        payloadExample = '`{ "chatId": "66..." }`';
        testInstruction = "**Message** tab-e event name `JOIN_CHAT` likhun ebong payload JSON format-e diye **Send** koren.";
    } else if (e.name === 'TYPING_START') {
        payloadExample = '`{ "chatId": "66..." }`';
        testInstruction = e.type === 'ON' ? "**Message** tab theke emit koren typing shuru bujhate." : "**Events** tab-e `TYPING_START` add koren listening-er jonno.";
    } else if (e.type === 'ON') {
        testInstruction = `**Message** tab-e event name \`${e.name}\` likhe JSON payload shoho **Send** koren.`;
    } else {
        testInstruction = `**Events** tab-e \`${e.name}\` nam-er ekta event add koren jate server theke response ashole apni **Messages** pane-e dekhte paren.`;
    }

    doc += `| \`${e.name}\` | ${actionType} | ${direction} | ${payloadExample} | ${testInstruction} |\n`;
  });

  return doc;
}

function generateCollection() {
  const collection: PostmanCollection = {
    info: {
      name: 'tbsosick',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      description: 'Automatically generated from UX flow documentation with testing guides.'
    },
    item: [],
    variable: [
      {
        key: "baseUrl",
        value: "http://localhost:5000/api/v1",
        type: "string"
      },
      {
        key: "accessToken",
        value: "",
        type: "string"
      },
      {
        key: "refreshToken",
        value: "",
        type: "string"
      }
    ]
  };

  // 1. Add Documentation & Guide Folder
  const socketDocs = getSocketEventsDocs();
  const guideFolder: PostmanFolder = {
    name: "🚀 Testing Guide & Docs",
    description: `
## Welcome to tbsosick API Testing Guide

Follow these detailed steps to test APIs and Socket events:

### 1. Setup & Auth (First Step)
1.  **Login**: First, go to **App Screens > Auth > 1.2 Login**.
2.  **Auto-Token**: Successful login korle \`accessToken\` automatic collection variable-e save hoye jabe.
3.  **Check**: Apni Collection-er **Variables** tab-e giye check korte paren token-ti set hoyeche kina.

### 2. Standard API Testing
- Protiti folder screen-er nam onujayi organized.
- Path variables (যেমন \`:id\`) thakle Postman-er **Params** tab-e value boshate hobe.

### 3. Socket.IO Testing (Detailed Guide)
Postman theke Socket test korar jonno nicher visual guide-ti follow koren:

#### A. Connection Setup
- Click **New** > **Socket.IO**.
- **URL**: \`http://localhost:5000\` (Not \`/api/v1\`).
- **Auth (Handshake)**:
    - **Handshake** tab-e jan.
    - **Auth** section-e **Auth Object** select koren.
    - \`token\` key-te value \`{{accessToken}}\` boshie **Connect** koren.

#### B. How to "Listen" (Receive events from server)
Server theke real-time data receive korar jonno nicher steps follow koren:

1.  **Events Tab**: Connection tab-er pashe thaka **Events** tab-e jan.
2.  **Add Event**: \`Add event\` button-e click koren.
3.  **Event Name**: \`Event name\` field-e nicher common event-gulo add koren (ekekti event-er jonno alada row):
    - \`USER_ONLINE\`: Jokhon keu online ashe.
    - \`MESSAGE_RECEIVED\`: Jokhon keu apnake message pathay.
    - \`TYPING_START\`: Keu type kora shuru korle.
    - \`get-notification::{{userId}}\`: Personal notifications-er jonno.
4.  **Messages Pane**: Ekhon server theke oi event-ti asle niche **Messages** pane-e real-time JSON data dekhabe. 
    > **Note**: Ekhane kono JSON pathano lagbe na, shudhu event-er nam-ti add korlei Postman server theke asha data capture korbe.

#### C. How to "Emit" (Send events to server)
- Server-e data pathanor jonno **Message** tab-e jan.
- **Event Name**: Jekhane event-er nam likhte hoy (যেমন: \`JOIN_CHAT\`).
- **Payload**: Niche JSON format-e data-ti likhun:
    \`\`\`json
    { "chatId": "664a1b2c3d4e5f6a7b8c9d0e" }
    \`\`\`
- Click **Send**.

${socketDocs}

### 4. Common Testing Scenarios
- **Chatting**:
    1. Login koren.
    2. Socket connect koren.
    3. \`JOIN_CHAT\` emit koren chatId diye.
    4. Onno user theke message pathale apni listener events-e sheta paben.
    `,
    item: []
  };
  collection.item.push(guideFolder);

  const screenFolders = fs.readdirSync(DOCS_DIR)
    .filter(f => f.endsWith('-screens') && fs.statSync(path.join(DOCS_DIR, f)).isDirectory());

  for (const folderName of screenFolders) {
    const folderPath = path.join(DOCS_DIR, folderName);
    const postmanFolder: PostmanFolder = {
      name: folderName.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      item: []
    };

    const files = fs.readdirSync(folderPath)
      .filter(f => f.endsWith('.md'))
      .sort();

    for (const fileName of files) {
      const filePath = path.join(folderPath, fileName);
      const screenName = fileName.replace(/^\d+-/, '').replace('.md', '').split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      
      const requests = parseMarkdownFile(filePath);
      
      if (requests.length > 0) {
        postmanFolder.item.push({
          name: screenName,
          item: requests
        });
      }
    }

    collection.item.push(postmanFolder);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(collection, null, 2));
  console.log(`Successfully generated Postman collection at: ${OUTPUT_FILE}`);
}

generateCollection();
