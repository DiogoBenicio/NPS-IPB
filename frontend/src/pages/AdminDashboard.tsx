import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Description as FileTextIcon,
  People as UsersIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChart3Icon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import CampaignCard from '../components/CampaignCard';
import CreateCampaignDialog from '../components/CreateCampaignDialog';
import EditCampaignDialog from '../components/EditCampaignDialog';
import { campaignsAPI, responsesAPI } from '../services/api';
import type { Campaign as CampaignType } from '../types/campaign';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignType | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const campaignsRes = await campaignsAPI.getAll();
        const campaignsData = campaignsRes.data.map((c: CampaignType) => ({
          ...c,
          responses: 0,
          averageScore: 0,
          responsesList: [],
        }));

        // Tentar carregar respostas
        try {
          const responsesRes = await responsesAPI.getAll();
          const responsesData = responsesRes.data;

          // Agrupar respostas por campanha
          campaignsData.forEach((campaign: CampaignType) => {
            const campaignResponses = responsesData.filter(
              (r: { campaignId: string }) => r.campaignId === campaign.id
            );
            campaign.responsesList = campaignResponses;
            campaign.responses = campaignResponses.length;
            if (campaignResponses.length > 0) {
              const avgScore =
                campaignResponses.reduce((sum: number, r: { score: number }) => sum + r.score, 0) /
                campaignResponses.length;
              campaign.averageScore = avgScore; // Manter escala 0-10
            }
          });
        } catch {
          // Ignorar erros de respostas
        }

        setCampaigns(campaignsData);
      } catch (error) {
        console.error(error);
      }
    };
    loadData();
  }, []);

  const totalResponses = campaigns.reduce((sum, c) => sum + c.responses, 0);
  const averageNPS = campaigns.length
    ? (campaigns.reduce((sum, c) => sum + c.averageScore, 0) / campaigns.length).toFixed(1)
    : '0.0';

  const stats = [
    {
      icon: FileTextIcon,
      label: 'Campanhas Ativas',
      value: campaigns.length,
      color: 'primary.main',
    },
    {
      icon: UsersIcon,
      label: 'Total de Respostas',
      value: totalResponses,
      color: 'secondary.main',
    },
    {
      icon: TrendingUpIcon,
      label: 'NPS Médio',
      value: averageNPS,
      color: 'hsl(44, 81%, 56%)',
    },
    {
      icon: BarChart3Icon,
      label: 'Taxa de Resposta',
      value: '78%',
      color: 'hsl(28, 52%, 45%)',
    },
  ];

  const handleCreateCampaign = async (
    name: string,
    welcomeText: string,
    questions: { id: string; text: string; type: 'yes-no' | 'text' }[]
  ) => {
    setLoading(true);
    try {
      await campaignsAPI.create({ name, welcomeText, questions });
      // Reload campaigns
      const res = await campaignsAPI.getAll();
      const campaignsData = res.data.map((c: CampaignType) => ({
        ...c,
        responses: 0,
        averageScore: 0,
        responsesList: [],
      }));
      setCampaigns(campaignsData);
      setShowCreateDialog(false);
      setSnackbar({
        open: true,
        message: 'Campanha criada com sucesso!',
        severity: 'success',
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: 'Erro ao criar campanha. Tente novamente.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaignToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!campaignToDelete) return;
    try {
      await campaignsAPI.delete(campaignToDelete);
      setCampaigns(campaigns.filter((c) => c.id !== campaignToDelete));
      setSnackbar({
        open: true,
        message: 'Campanha excluída com sucesso!',
        severity: 'success',
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: 'Erro ao excluir campanha. Tente novamente.',
        severity: 'error',
      });
    } finally {
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);
    }
  };

  const handleEditCampaign = (id: string) => {
    const campaign = campaigns.find((c) => c.id === id);
    if (campaign) {
      setEditingCampaign(campaign);
      setShowEditDialog(true);
    }
  };

  const handleUpdateCampaign = async (
    id: string,
    name: string,
    welcomeText: string,
    questions: { id: string; text: string; type: 'yes-no' | 'text' }[]
  ) => {
    setLoading(true);
    try {
      await campaignsAPI.update(id, { name, welcomeText, questions });
      // Reload campaigns
      const res = await campaignsAPI.getAll();
      const campaignsData = res.data.map((c: CampaignType) => ({
        ...c,
        responses: 0,
        averageScore: 0,
        responsesList: [],
      }));
      setCampaigns(campaignsData);
      setShowEditDialog(false);
      setEditingCampaign(null);
      setSnackbar({
        open: true,
        message: 'Campanha atualizada com sucesso!',
        severity: 'success',
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: 'Erro ao atualizar campanha. Tente novamente.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/campaign-details/${id}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'hsl(40, 33%, 96%)' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, hsl(213, 52%, 24%) 0%, hsl(28, 52%, 28%) 100%)',
          pt: 8,
          pb: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            background: 'rgba(245, 240, 232, 0.1)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            background: 'rgba(245, 240, 232, 0.05)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
        />

        {/* Pattern Background */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.3,
          }}
        />

        <Box sx={{ maxWidth: 'xl', mx: 'auto', px: 4, position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 1,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                className="animate-fade-in"
                sx={{
                  fontFamily: 'Merriweather, serif',
                  fontWeight: 700,
                  color: 'white',
                  mb: 1,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                Dashboard NPS
              </Typography>
              <Typography
                variant="h6"
                className="animate-fade-in"
                sx={{
                  fontFamily: 'Open Sans, sans-serif',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 400,
                  fontSize: { xs: '1rem', md: '1.15rem' },
                  animationDelay: '0.1s',
                }}
              >
                Gerencie suas pesquisas de satisfação
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<ExitToAppIcon />}
              onClick={() => navigate('/')}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                borderRadius: 2,
                fontFamily: 'Open Sans, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                px: 3,
                mt: 1,
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:focus, &:focus-visible': {
                  outline: 'none',
                },
              }}
            >
              Sair
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 'xl', mx: 'auto', px: 4, mt: -6, position: 'relative', zIndex: 2 }}>
        {/* Stats Section */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 2,
            mb: 6,
          }}
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Box key={stat.label}>
                <Card
                  className="animate-slide-up"
                  sx={{
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    animationDelay: `${i * 0.1}s`,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: stat.color,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <Icon sx={{ fontSize: 20, color: 'white' }} />
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        fontFamily: 'Merriweather, serif',
                        color: 'text.primary',
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'Open Sans, sans-serif',
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>

        {/* Campaigns Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Merriweather, serif',
                fontWeight: 700,
                color: 'text.primary',
                fontSize: { xs: '1.75rem', md: '2rem' },
              }}
            >
              Campanhas NPS
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Open Sans, sans-serif',
                color: 'text.secondary',
              }}
            >
              Gerencie suas pesquisas de satisfação
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setShowCreateDialog(true)}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontFamily: 'Open Sans, sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 2px 12px -2px hsl(213 52% 24% / 0.3)',
              '&:hover': {
                boxShadow: '0 8px 30px -8px hsl(213 52% 24% / 0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
              display: { xs: 'none', sm: 'flex' },
            }}
          >
            Nova Campanha
          </Button>
        </Box>

        {campaigns.length === 0 ? (
          <Card
            className="animate-fade-in"
            sx={{
              textAlign: 'center',
              py: 8,
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <CardContent>
              <FileTextIcon
                sx={{
                  fontSize: 64,
                  color: 'text.secondary',
                  opacity: 0.3,
                  mb: 2,
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'Merriweather, serif',
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                Nenhuma campanha criada
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'Open Sans, sans-serif',
                  color: 'text.secondary',
                  mb: 3,
                }}
              >
                Crie sua primeira campanha NPS para começar a coletar feedback.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setShowCreateDialog(true)}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontFamily: 'Open Sans, sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 2px 12px -2px hsl(213 52% 24% / 0.3)',
                  '&:hover': {
                    boxShadow: '0 8px 30px -8px hsl(213 52% 24% / 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Nova Campanha
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {campaigns.map((campaign, i) => (
              <Box key={campaign.id}>
                <Box
                  sx={{
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  <CampaignCard
                    campaign={campaign}
                    onDelete={handleDeleteCampaign}
                    onEdit={handleEditCampaign}
                    onViewDetails={handleViewDetails}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Dialog para criar campanha */}
      <CreateCampaignDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={handleCreateCampaign}
        loading={loading}
      />

      {/* Dialog para editar campanha */}
      <EditCampaignDialog
        open={showEditDialog}
        campaign={editingCampaign}
        onClose={() => {
          setShowEditDialog(false);
          setEditingCampaign(null);
        }}
        onSubmit={handleUpdateCampaign}
        loading={loading}
      />

      {/* Mobile FAB */}
      <Button
        variant="contained"
        onClick={() => setShowCreateDialog(true)}
        sx={{
          display: { xs: 'flex', sm: 'none' },
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          minWidth: 56,
          borderRadius: '50%',
          boxShadow: '0 4px 20px -4px hsl(213 52% 24% / 0.4)',
          zIndex: 1000,
        }}
      >
        <FileTextIcon />
      </Button>

      {/* Dialog de confirmação de exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontFamily: 'Merriweather, serif',
            fontWeight: 700,
          }}
        >
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: 'Open Sans, sans-serif',
              color: 'text.secondary',
            }}
          >
            Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita e todas as
            respostas associadas serão perdidas.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              fontFamily: 'Open Sans, sans-serif',
              textTransform: 'none',
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            sx={{
              fontFamily: 'Open Sans, sans-serif',
              textTransform: 'none',
            }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            fontFamily: 'Open Sans, sans-serif',
            boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.3)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;
