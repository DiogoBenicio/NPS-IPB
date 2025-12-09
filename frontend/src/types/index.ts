export interface User {
  id: string;
  email: string;
  role: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Survey {
  id: string;
  campaignId: string;
  question: string;
  type: string;
}

export interface Response {
  id: string;
  surveyId: string;
  score: number;
  comment?: string;
  email?: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  email: string;
  name?: string;
}
