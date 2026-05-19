import { Content } from '../content/content.model';

const getVipContentFromDB = async () => {
  const cardFields = 'title thumbnail poster type rating isPremium isRecent';
  
  const sections = [];

  // 1. VIP Top Picks
  const topPicks = await Content.find({ isPremium: true, rating: { $gte: 4.5 } })
    .select(cardFields)
    .limit(10);
  
  if (topPicks.length > 0) {
    sections.push({
      id: 'vip_top_picks',
      type: 'VIP_PICKS',
      title: 'Top VIP Picks',
      items: topPicks,
    });
  }

  // 2. Hot Now (Premium with high views)
  const hotNow = await Content.find({ isPremium: true })
    .sort({ views: -1 })
    .select(cardFields)
    .limit(10);

  if (hotNow.length > 0) {
    sections.push({
      id: 'vip_hot_now',
      type: 'HOT_NOW',
      title: 'Hot Now on VIP',
      items: hotNow,
    });
  }

  // 3. New on VIP
  const newOnVip = await Content.find({ isPremium: true, isRecent: true })
    .sort({ createdAt: -1 })
    .select(cardFields)
    .limit(10);

  if (newOnVip.length > 0) {
    sections.push({
      id: 'vip_new',
      type: 'NEW_VIP',
      title: 'New on VIP',
      items: newOnVip,
    });
  }

  return {
    sections,
  };
};

export const VipService = {
  getVipContentFromDB,
};
