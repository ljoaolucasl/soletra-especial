import type { CampaignState } from "./types";

const KEY_PREFIX = "soletra_campaign_v2:";

export function loadCampaign(campaignId: string): CampaignState | null {
  const raw = localStorage.getItem(KEY_PREFIX + campaignId);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CampaignState;
    if (parsed?.version !== 2 || parsed.campaignId !== campaignId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveCampaign(state: CampaignState): void {
  localStorage.setItem(KEY_PREFIX + state.campaignId, JSON.stringify(state));
}

export function clearCampaign(campaignId: string): void {
  localStorage.removeItem(KEY_PREFIX + campaignId);
}