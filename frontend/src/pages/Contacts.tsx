import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Email as EmailIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import PageLayout from '../components/PageLayout';
import { campaignsAPI, responsesAPI } from '../services/api';
import type { Campaign, NPSResponse } from '../types/campaign';

interface Contact {
  id: string;
  name: string;
  email: string;
  campaignId: string;
  campaignName: string;
  score: number;
  createdAt: Date;
}

const Contacts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
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

  // Collect all identified contacts
  const contacts: Contact[] = allResponses
    .filter((r) => r.name && r.email)
    .map((r) => {
      const campaign = campaigns.find((c) => c.id === r.campaignId);
      return {
        id: r.id,
        name: r.name!,
        email: r.email!,
        campaignId: r.campaignId,
        campaignName: campaign?.name || 'Campanha Desconhecida',
        score: r.score,
        createdAt: new Date(r.createdAt),
      };
    });

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.campaignName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendEmail = (contact: Contact) => {
    window.location.href = `mailto:${contact.email}?subject=Obrigado pela sua avaliação - ${contact.campaignName}`;
  };

  const handleSendEmailAll = () => {
    const emails = filteredContacts.map((c) => c.email).join(',');
    if (emails) {
      window.location.href = `mailto:${emails}?subject=Agradecimento pela sua avaliação`;
    }
  };

  const getScoreColor = (score: number): string => {
    if (score <= 6) return 'hsl(0, 70%, 60%)';
    if (score <= 8) return 'hsl(45, 80%, 55%)';
    return 'hsl(142, 71%, 45%)';
  };

  const getScoreLabel = (score: number): string => {
    if (score <= 6) return 'Detrator';
    if (score <= 8) return 'Neutro';
    return 'Promotor';
  };

  return (
    <PageLayout
      title="Contatos"
      subtitle={`Usuários identificados (${contacts.length} total)`}
      action={
        filteredContacts.length > 0 ? (
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSendEmailAll}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
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
            Email para todos ({filteredContacts.length})
          </Button>
        ) : undefined
      }
    >
      {/* Search */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          boxShadow: '0 2px 12px -2px hsl(213 52% 24% / 0.1)',
        }}
      >
        <CardContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            placeholder="Buscar por nome, email ou campanha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'primary.main' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontFamily: 'Open Sans, sans-serif',
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Contacts List */}
      {filteredContacts.length === 0 ? (
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 2px 12px -2px hsl(213 52% 24% / 0.1)',
          }}
        >
          <CardContent sx={{ py: 8, textAlign: 'center' }}>
            <PersonIcon
              sx={{
                fontSize: 64,
                color: 'text.secondary',
                opacity: 0.3,
                mb: 2,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Merriweather, serif',
                fontWeight: 700,
                color: 'text.primary',
                mb: 1,
              }}
            >
              Nenhum contato encontrado
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'Open Sans, sans-serif',
                color: 'text.secondary',
              }}
            >
              {contacts.length === 0
                ? 'Ainda não há usuários identificados nas respostas.'
                : 'Nenhum resultado para sua busca.'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'grid', gap: 2 }}>
          {filteredContacts.map((contact) => (
            <Card
              key={contact.id}
              className="animate-fade-in"
              sx={{
                borderRadius: 3,
                boxShadow: '0 2px 12px -2px hsl(213 52% 24% / 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px -8px hsl(213 52% 24% / 0.2)',
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: 'primary.main',
                        fontFamily: 'Merriweather, serif',
                        fontWeight: 700,
                        fontSize: '1.25rem',
                      }}
                    >
                      {contact.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontFamily: 'Open Sans, sans-serif',
                          fontWeight: 600,
                          color: 'text.primary',
                        }}
                      >
                        {contact.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'Open Sans, sans-serif',
                            color: 'text.secondary',
                          }}
                        >
                          {contact.email}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Chip
                          label={contact.campaignName}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontFamily: 'Open Sans, sans-serif',
                            fontSize: '0.75rem',
                            borderRadius: 1.5,
                          }}
                        />
                        <Chip
                          icon={<StarIcon sx={{ fontSize: 14 }} />}
                          label={`${getScoreLabel(contact.score)}: ${contact.score}`}
                          size="small"
                          sx={{
                            bgcolor: getScoreColor(contact.score),
                            color: 'white',
                            fontFamily: 'Open Sans, sans-serif',
                            fontSize: '0.75rem',
                            borderRadius: 1.5,
                            '& .MuiChip-icon': {
                              color: 'white',
                            },
                          }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: 'Open Sans, sans-serif',
                              color: 'text.secondary',
                            }}
                          >
                            {contact.createdAt.toLocaleDateString('pt-BR')}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EmailIcon />}
                    onClick={() => handleSendEmail(contact)}
                    sx={{
                      borderRadius: 2,
                      fontFamily: 'Open Sans, sans-serif',
                      fontWeight: 600,
                      textTransform: 'none',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px -2px hsl(213 52% 24% / 0.2)',
                      },
                    }}
                  >
                    Enviar Email
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </PageLayout>
  );
};

export default Contacts;
