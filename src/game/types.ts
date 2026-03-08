export type CampaignState = {
  version: 2;
  campaignId: string;
  currentRoundIndex: number;
  unlockedRoundIndex: number;
  totalScore: number;

  foundByRound: Record<string, string[]>;
  specialsFound: Record<string, boolean>;

  updatedAt: number;
};