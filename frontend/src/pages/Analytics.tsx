import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Card, CardContent } from '@mui/material';
import {
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  TrackChanges as TargetIcon,
} from '@mui/icons-material';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { campaignsAPI, responsesAPI } from '../services/api';
import type { Campaign, NPSResponse } from '../types/campaign';
import PageLayout from '../components/PageLayout';

const Analytics: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [allResponses, setAllResponses] = useState<NPSResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignsRes, responsesRes] = await Promise.all([
          campaignsAPI.getAll(),
          responsesAPI.getAll(),
        ]);
        setCampaigns(campaignsRes.data);
        setAllResponses(responsesRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    fetchData();
  }, []);

  // Cálculos NPS
  const totalResponses = allResponses.length;
  const detractors = allResponses.filter((r) => r.score <= 6).length;
  const passives = allResponses.filter((r) => r.score > 6 && r.score <= 8).length;
  const promoters = allResponses.filter((r) => r.score > 8).length;
  const overallNPS =
    totalResponses > 0 ? Math.round(((promoters - detractors) / totalResponses) * 100) : 0;
  const identified = allResponses.filter((r) => r.name && r.email).length;

  // Dados dos gráficos
  const distributionData = [detractors, passives, promoters];

  const campaignNPSData = campaigns.map((campaign) => {
    const campResponses = allResponses.filter((r) => r.campaignId === campaign.id);
    const total = campResponses.length;
    const det = campResponses.filter((r) => r.score <= 6).length;
    const prom = campResponses.filter((r) => r.score > 8).length;
    const nps = total > 0 ? Math.round(((prom - det) / total) * 100) : 0;
    return {
      name: campaign.name.length > 20 ? campaign.name.substring(0, 20) + '...' : campaign.name,
      nps,
    };
  });

  const scoreDistribution = [...Array(11)].map((_, i) => ({
    score: i,
    count: allResponses.filter((r) => r.score === i).length,
  }));

  const pieChartOptions: ApexOptions = {
    chart: {
      type: 'pie',
      fontFamily: 'Open Sans, sans-serif',
    },
    labels: ['Detratores (0-6)', 'Neutros (7-8)', 'Promotores (9-10)'],
    colors: ['hsl(0, 70%, 50%)', 'hsl(45, 80%, 45%)', 'hsl(142, 71%, 35%)'],
    legend: {
      position: 'bottom',
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  // Gráfico de Barras - NPS por Campanha
  const barChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      fontFamily: 'Open Sans, sans-serif',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['hsl(213, 52%, 24%)'],
    xaxis: {
      min: -100,
      max: 100,
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
        },
      },
    },
    grid: {
      borderColor: '#f1f1f1',
    },
  };

  const barChartSeries = [
    {
      name: 'NPS',
      data: campaignNPSData.map((c) => ({ x: c.name, y: c.nps })),
    },
  ];

  // Gráfico de Distribuição de Scores
  const scoreChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      fontFamily: 'Open Sans, sans-serif',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '70%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['hsl(213, 52%, 24%)'],
    xaxis: {
      categories: scoreDistribution.map((s) => s.score.toString()),
      title: {
        text: 'Score',
      },
    },
    yaxis: {
      title: {
        text: 'Quantidade',
      },
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

  return (
    <PageLayout title="Analytics Geral" subtitle="Visão geral de todas as campanhas NPS">
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: 'primary.main',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BarChartIcon sx={{ fontSize: 20, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {campaigns.length}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontFamily: 'Open Sans, sans-serif' }}
                >
                  Campanhas
                </Typography>
              </Box>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: 'secondary.main',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PeopleIcon sx={{ fontSize: 20, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {totalResponses}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontFamily: 'Open Sans, sans-serif' }}
                >
                  Total Respostas
                </Typography>
              </Box>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor:
                    overallNPS >= 50
                      ? 'hsl(142, 71%, 35%)'
                      : overallNPS >= 0
                        ? 'hsl(45, 80%, 45%)'
                        : 'hsl(0, 70%, 50%)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 20, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {overallNPS}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontFamily: 'Open Sans, sans-serif' }}
                >
                  NPS Geral
                </Typography>
              </Box>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: 'hsl(44, 81%, 56%)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TargetIcon sx={{ fontSize: 20, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {identified}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontFamily: 'Open Sans, sans-serif' }}
                >
                  Identificados
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Charts Row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
          gap: 3,
          mb: 3,
        }}
      >
        <Paper
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
            NPS por Campanha
          </Typography>
          <ReactApexChart
            options={barChartOptions}
            series={barChartSeries}
            type="bar"
            height={300}
          />
        </Paper>

        <Paper
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
            Distribuição de Respostas
          </Typography>
          <ReactApexChart
            options={pieChartOptions}
            series={distributionData}
            type="pie"
            height={300}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'hsl(0, 70%, 50%)' }}
              />
              <Typography variant="body2" sx={{ fontFamily: 'Open Sans, sans-serif' }}>
                Detratores
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'hsl(45, 80%, 45%)' }}
              />
              <Typography variant="body2" sx={{ fontFamily: 'Open Sans, sans-serif' }}>
                Neutros
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'hsl(142, 71%, 35%)' }}
              />
              <Typography variant="body2" sx={{ fontFamily: 'Open Sans, sans-serif' }}>
                Promotores
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Distribution Chart */}
      <Paper
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
          height={350}
        />
      </Paper>
    </PageLayout>
  );
};

export default Analytics;
