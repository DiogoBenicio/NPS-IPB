import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Paper,
  CircularProgress,
  Avatar,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { campaignsAPI, responsesAPI } from '../services/api';
import type { Campaign, NPSResponse } from '../types/campaign';

const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [responses, setResponses] = useState<NPSResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [campaignRes, responsesRes] = await Promise.all([
          campaignsAPI.getById(id),
          responsesAPI.getAll(),
        ]);
        setCampaign(campaignRes.data);
        setResponses(responsesRes.data.filter((r: NPSResponse) => r.campaignId === id));
      } catch (error) {
        console.error('Erro ao carregar campanha:', error);
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!campaign) {
    return null;
  }

  // Calculate NPS distribution
  const total = responses.length;
  const detractors = responses.filter((r) => r.score <= 6).length;
  const passives = responses.filter((r) => r.score > 6 && r.score <= 8).length;
  const promoters = responses.filter((r) => r.score > 8).length;
  const npsScore = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0;
  const withComments = responses.filter((r) => r.comment).length;
  const identified = responses.filter((r) => r.name && r.email).length;

  // Score distribution
  const scoreDistribution = [...Array(11)].map((_, i) => ({
    score: i.toString(),
    count: responses.filter((r) => r.score === i).length,
  }));

  // Chart config
  const scoreChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      fontFamily: 'Open Sans, sans-serif',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '70%',
      },
    },
    dataLabels: { enabled: false },
    colors: ['hsl(213, 52%, 24%)'],
    xaxis: {
      categories: scoreDistribution.map((s) => s.score),
      title: { text: 'Score' },
    },
    yaxis: {
      title: { text: 'Quantidade' },
    },
    grid: {
      borderColor: '#f1f1f1',
    },
  };

  const scoreChartSeries = [
    {
      name: 'Respostas',
      data: scoreDistribution.map((s) => s.count),
    },
  ];

  // Pie chart config
  const distributionData = [promoters, passives, detractors];
  const pieChartOptions: ApexOptions = {
    chart: {
      type: 'pie',
      fontFamily: 'Open Sans, sans-serif',
    },
    labels: ['Promotores (9-10)', 'Neutros (7-8)', 'Detratores (0-6)'],
    colors: ['hsl(142, 71%, 35%)', 'hsl(45, 80%, 45%)', 'hsl(0, 70%, 50%)'],
    legend: {
      position: 'bottom',
    },
  };

  const getScoreColor = (score: number): string => {
    if (score <= 6) return 'hsl(0, 70%, 50%)';
    if (score <= 8) return 'hsl(45, 80%, 45%)';
    return 'hsl(142, 71%, 35%)';
  };

  const getScoreLabel = (score: number): string => {
    if (score <= 6) return 'Detrator';
    if (score <= 8) return 'Neutro';
    return 'Promotor';
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header with gradient */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, hsl(213, 52%, 24%) 0%, hsl(28, 52%, 28%) 100%)',
          position: 'relative',
          overflow: 'hidden',
          pt: 8,
          pb: 12,
        }}
      >
        {/* Decorative blur elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '40%',
            height: '140%',
            background: 'rgba(245, 240, 232, 0.1)',
            filter: 'blur(60px)',
            borderRadius: '50%',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-30%',
            left: '-10%',
            width: '35%',
            height: '120%',
            background: 'rgba(245, 240, 232, 0.08)',
            filter: 'blur(60px)',
            borderRadius: '50%',
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

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/admin')}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                borderRadius: 2,
                fontFamily: 'Open Sans, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                px: 3,
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Voltar
            </Button>
          </Box>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'Merriweather, serif',
                fontWeight: 700,
                color: 'white',
                mb: 1,
              }}
            >
              {campaign.name}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Open Sans, sans-serif',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              {campaign.welcomeText || campaign.description}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ px: 4, mt: -6, pb: 6 }}>
        {/* Stats Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 2,
            mb: 4,
          }}
        >
          <Card
            className="animate-slide-up"
            sx={{
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
              },
            }}
          >
            <CardContent sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: 'primary.main',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5,
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 24, color: 'white' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {total}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontFamily: 'Open Sans, sans-serif' }}
                >
                  Respostas
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card
            className="animate-slide-up"
            sx={{
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              animationDelay: '0.1s',
              '&:hover': {
                transform: 'translateY(-4px)',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
              },
            }}
          >
            <CardContent sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor:
                      npsScore >= 50
                        ? 'hsl(142, 71%, 35%)'
                        : npsScore >= 0
                          ? 'hsl(45, 80%, 45%)'
                          : 'hsl(0, 70%, 50%)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5,
                  }}
                >
                  <TrendingUpIcon sx={{ fontSize: 24, color: 'white' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {npsScore}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontFamily: 'Open Sans, sans-serif' }}
                >
                  NPS Score
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card
            className="animate-slide-up"
            sx={{
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              animationDelay: '0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
              },
            }}
          >
            <CardContent sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: 'secondary.main',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5,
                  }}
                >
                  <MessageIcon sx={{ fontSize: 24, color: 'white' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {withComments}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontFamily: 'Open Sans, sans-serif' }}
                >
                  Comentários
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card
            className="animate-slide-up"
            sx={{
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              animationDelay: '0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
              },
            }}
          >
            <CardContent sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: 'hsl(44, 81%, 46%)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5,
                  }}
                >
                  <PersonIcon sx={{ fontSize: 24, color: 'white' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {identified}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontFamily: 'Open Sans, sans-serif' }}
                >
                  Identificados
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Charts */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
            gap: 3,
            mb: 3,
          }}
        >
          <Paper
            className="animate-slide-up"
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Merriweather, serif',
                fontWeight: 700,
                mb: 3,
                color: 'primary.main',
              }}
            >
              Distribuição de Notas
            </Typography>
            <ReactApexChart
              options={scoreChartOptions}
              series={scoreChartSeries}
              type="bar"
              height={250}
            />
          </Paper>

          <Paper
            className="animate-slide-up"
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              animationDelay: '0.1s',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Merriweather, serif',
                fontWeight: 700,
                mb: 3,
                color: 'primary.main',
              }}
            >
              Classificação NPS
            </Typography>
            <ReactApexChart
              options={pieChartOptions}
              series={distributionData}
              type="pie"
              height={250}
            />
          </Paper>
        </Box>

        {/* Responses List */}
        <Paper
          className="animate-slide-up"
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animationDelay: '0.2s',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Merriweather, serif',
              fontWeight: 700,
              mb: 3,
              color: 'primary.main',
            }}
          >
            Respostas Recentes ({responses.length})
          </Typography>
          {responses.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography
                variant="body1"
                sx={{ color: 'text.secondary', fontFamily: 'Open Sans, sans-serif' }}
              >
                Nenhuma resposta ainda.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gap: 2 }}>
              {responses.slice(0, 10).map((response) => (
                <Card
                  key={response.id}
                  sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 2px 8px -2px hsl(213 52% 24% / 0.1)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      {response.name ? (
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'primary.main',
                            fontSize: '1rem',
                            fontWeight: 700,
                          }}
                        >
                          {response.name.charAt(0).toUpperCase()}
                        </Avatar>
                      ) : (
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'grey.300',
                          }}
                        >
                          <PersonIcon />
                        </Avatar>
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 1,
                            flexWrap: 'wrap',
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: 'Open Sans, sans-serif',
                              fontWeight: 600,
                            }}
                          >
                            {response.name || 'Anônimo'}
                          </Typography>
                          <Chip
                            label={`${getScoreLabel(response.score)}: ${response.score}`}
                            size="small"
                            sx={{
                              bgcolor: getScoreColor(response.score),
                              color: 'white',
                              fontFamily: 'Open Sans, sans-serif',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontFamily: 'Open Sans, sans-serif',
                            }}
                          >
                            {new Date(response.createdAt).toLocaleDateString('pt-BR')}
                          </Typography>
                        </Box>
                        {response.email && (
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: 'Open Sans, sans-serif',
                              color: 'text.secondary',
                              display: 'block',
                              mb: 1,
                            }}
                          >
                            {response.email}
                          </Typography>
                        )}
                        {(response.comment ||
                          (response.answers &&
                            Array.isArray(response.answers) &&
                            response.answers.length > 0)) && (
                          <Accordion
                            sx={{
                              mt: 1,
                              boxShadow: 'none',
                              border: 'none',
                              borderRadius: '0 !important',
                              '&:before': { display: 'none' },
                              '&.Mui-expanded': { margin: '8px 0 0 0' },
                              bgcolor: 'transparent',
                            }}
                            disableGutters
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              sx={{
                                minHeight: '32px',
                                px: 0,
                                '&.Mui-expanded': { minHeight: '32px' },
                                '& .MuiAccordionSummary-content': {
                                  margin: '4px 0',
                                  '&.Mui-expanded': { margin: '4px 0' },
                                },
                                '&:focus, &:focus-visible, &:focus-within': {
                                  outline: 'none !important',
                                },
                                '& .MuiButtonBase-root': {
                                  outline: 'none !important',
                                },
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  fontFamily: 'Open Sans, sans-serif',
                                  fontWeight: 600,
                                  color: 'primary.main',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                  fontSize: '0.7rem',
                                }}
                              >
                                Ver detalhes da resposta
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ pt: 0, px: 0, pb: 1 }}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {response.comment && (
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontFamily: 'Open Sans, sans-serif',
                                        fontWeight: 600,
                                        color: 'text.secondary',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        fontSize: '0.7rem',
                                      }}
                                    >
                                      Comentário:
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontFamily: 'Open Sans, sans-serif',
                                        color: 'text.secondary',
                                        mt: 0.5,
                                      }}
                                    >
                                      &ldquo;{response.comment}&rdquo;
                                    </Typography>
                                  </Box>
                                )}
                                {response.answers &&
                                  Array.isArray(response.answers) &&
                                  response.answers.length > 0 && (
                                    <Box>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          fontFamily: 'Open Sans, sans-serif',
                                          fontWeight: 600,
                                          color: 'text.secondary',
                                          textTransform: 'uppercase',
                                          letterSpacing: '0.5px',
                                          fontSize: '0.7rem',
                                          mb: 1,
                                          display: 'block',
                                        }}
                                      >
                                        Perguntas Adicionais:
                                      </Typography>
                                      <Box
                                        sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                                      >
                                        {response.answers.map(
                                          (
                                            answer: {
                                              questionId: string;
                                              answer: string | boolean;
                                            },
                                            index: number
                                          ) => {
                                            const question = campaign.questions?.find(
                                              (q: {
                                                id: string;
                                                text: string;
                                                type: 'yes-no' | 'text';
                                              }) => q.id === answer.questionId
                                            );
                                            return (
                                              <Box key={index}>
                                                <Typography
                                                  variant="caption"
                                                  sx={{
                                                    fontFamily: 'Open Sans, sans-serif',
                                                    color: 'text.secondary',
                                                    fontWeight: 600,
                                                  }}
                                                >
                                                  {question?.text || 'Pergunta'}:
                                                </Typography>
                                                <Typography
                                                  variant="body2"
                                                  sx={{
                                                    fontFamily: 'Open Sans, sans-serif',
                                                    color: 'text.primary',
                                                    ml: 1,
                                                  }}
                                                >
                                                  {typeof answer.answer === 'boolean'
                                                    ? answer.answer
                                                      ? 'Sim'
                                                      : 'Não'
                                                    : answer.answer}
                                                </Typography>
                                              </Box>
                                            );
                                          }
                                        )}
                                      </Box>
                                    </Box>
                                  )}
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default CampaignDetails;
