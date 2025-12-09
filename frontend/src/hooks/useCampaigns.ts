import { useState, useEffect, useCallback } from 'react';
import { campaignsAPI, responsesAPI } from '../services/api';
import type { Campaign, NPSResponse } from '../types/campaign';

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const res = await campaignsAPI.getAll();

      // Load responses for each campaign
      const campaignsWithResponses = await Promise.all(
        res.data.map(async (campaign: Campaign) => {
          try {
            const allResponses = await responsesAPI.getAll();
            const campaignResponses = allResponses.data
              .filter((r: NPSResponse) => r.campaignId === campaign.id)
              .map((r: NPSResponse) => ({
                ...r,
                createdAt: new Date(r.createdAt),
              }));

            const avgScore =
              campaignResponses.length > 0
                ? campaignResponses.reduce((sum: number, r: NPSResponse) => sum + r.score, 0) /
                  campaignResponses.length
                : 0;

            return {
              ...campaign,
              createdAt: new Date(campaign.createdAt),
              responses: campaignResponses.length,
              averageScore: avgScore,
              responsesList: campaignResponses,
            };
          } catch {
            return {
              ...campaign,
              createdAt: new Date(campaign.createdAt),
              responses: 0,
              averageScore: 0,
              responsesList: [],
            };
          }
        })
      );

      setCampaigns(campaignsWithResponses);
      setError(null);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      setError('Erro ao carregar campanhas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const addCampaign = async (name: string, welcomeText: string) => {
    try {
      await campaignsAPI.create({ name, welcomeText });
      await loadCampaigns();
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw new Error('Erro ao criar campanha');
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      // Backend should implement DELETE /api/campaigns/:id
      await campaignsAPI.getAll(); // Placeholder - replace with actual delete
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw new Error('Erro ao excluir campanha');
    }
  };

  const addResponse = async (
    campaignId: string,
    score: number,
    comment?: string,
    respondent?: { name: string; email: string }
  ) => {
    try {
      await responsesAPI.submit({
        campaignId,
        score,
        comment,
        name: respondent?.name,
        email: respondent?.email,
      });
      await loadCampaigns();
    } catch (error) {
      console.error('Error adding response:', error);
      throw new Error('Erro ao enviar resposta');
    }
  };

  return {
    campaigns,
    loading,
    error,
    addCampaign,
    deleteCampaign,
    addResponse,
    reload: loadCampaigns,
  };
};
