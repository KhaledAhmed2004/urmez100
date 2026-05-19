import { User } from '../user/user.model';

const getVipRankingsFromDB = async () => {
  const result = await User.find({ role: 'USER' })
    .sort({ points: -1 })
    .limit(10)
    .select('name points');

  const rankedResult = result.map((user, index) => ({
    rank: index + 1,
    name: user.name,
    points: user.points || 0,
  }));

  return rankedResult;
};

export const RankingService = {
  getVipRankingsFromDB,
};
