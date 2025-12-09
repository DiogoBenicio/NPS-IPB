export interface NPSResponse {
  id: string;
  campaignId: string;
  score: number;
  comment?: string;
  createdAt: Date;
  name?: string;
  email?: string;
  answers?: Array<{
    questionId: string;
    answer: string | boolean;
  }>;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  welcomeText?: string;
  createdAt: Date;
  responses: number;
  averageScore: number;
  responsesList: NPSResponse[];
  questions?: Array<{
    id: string;
    text: string;
    type: 'yes-no' | 'text';
  }>;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  campaignId?: string;
  campaignName?: string;
  score?: number;
  createdAt?: Date;
}
