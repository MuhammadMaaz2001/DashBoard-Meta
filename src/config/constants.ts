
export const API_BASE_URL = 'https://meta-dashboard-backend-8a3151f26465.herokuapp.com/api';


export const CAMPAIGN_OBJECTIVES = [
  'OUTCOME_AWARENESS',
  'OUTCOME_LEADS',
  'LEAD_GENERATION',
  'REACH',
  'POST_ENGAGEMENT',
  'VIDEO_VIEWS',
  'BRAND_AWARENESS',
  'CONVERSIONS',
  'LINK_CLICKS',
  'OUTCOME_TRAFFIC',
  'OUTCOME_ENGAGEMENT',
] as const;
console.log("Campaign Objectives:", CAMPAIGN_OBJECTIVES);

export const AD_ACCOUNT_STATUS = {
  ACTIVE: 1,
  INACTIVE: 101,
} as const;

export const CAMPAIGN_STATUS = {
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
} as const;
