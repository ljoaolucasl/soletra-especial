export type CampaignState = {
  version: 2;
  campaignId: string;
  currentRoundIndex: number;
  unlockedRoundIndex: number; // até qual rodada está liberada
  totalScore: number;

  foundByRound: Record<string, string[]>; // round.id -> palavras encontradas
  specialsFound: Record<string, boolean>; // round.id -> special encontrada

  updatedAt: number;
};