import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Typography,
  Radio,
  RadioGroup,
} from '@mui/material';
import { campaignsAPI, responsesAPI } from '../services/api';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import ChurchIcon from '@mui/icons-material/Church';

interface Question {
  id: string;
  text: string;
  type: 'yes-no' | 'text';
}

const NpsCampaign: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [wantsToIdentify, setWantsToIdentify] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [campaign, setCampaign] = useState<{
    name: string;
    welcomeText: string;
    questions?: Question[];
  } | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});

  useEffect(() => {
    if (!campaignId) return;
    const loadCampaign = async () => {
      try {
        const res = await campaignsAPI.getByIdPublic(campaignId);
        setCampaign({
          name: res.data.name,
          welcomeText:
            res.data.welcomeText || res.data.description || 'Sua opinião é importante para nós!',
          questions: res.data.questions || [],
        });
      } catch (err) {
        console.error('Erro ao carregar campanha:', err);
      }
    };
    loadCampaign();
  }, [campaignId]);

  if (!campaign && !campaignId) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (score === null) {
      alert('Por favor, selecione uma nota de 0 a 10.');
      return;
    }

    if (wantsToIdentify && (!name.trim() || !email.trim())) {
      alert('Por favor, preencha seu nome e email.');
      return;
    }

    try {
      const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));

      const payload = {
        campaignId: campaignId || '',
        name: wantsToIdentify ? name.trim() : undefined,
        email: wantsToIdentify ? email.trim() : undefined,
        score,
        comment: comment || undefined,
        answers: answersArray.length > 0 ? answersArray : undefined,
      };

      await responsesAPI.submit(payload);
      setSubmitted(true);
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      alert('Erro ao enviar avaliação. Tente novamente.');
    }
  };

  const getScoreColor = (value: number) => {
    if (value <= 6) return 'hsl(0, 70%, 60%)';
    if (value <= 8) return 'hsl(44, 81%, 56%)';
    return 'hsl(142, 71%, 45%)';
  };

  const getScoreEmoji = (value: number) => {
    if (value <= 2) return '☹️';
    if (value <= 4) return '🙁';
    if (value <= 6) return '😐';
    if (value <= 8) return '🙂';
    if (value === 9) return '😊';
    return '😃';
  };

  if (submitted) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Card
          className="animate-scale-in"
          sx={{
            maxWidth: 448,
            width: '100%',
            textAlign: 'center',
            borderRadius: 3,
            boxShadow: '0 2px 12px -2px hsl(213 52% 24% / 0.1)',
          }}
        >
          <CardContent sx={{ pt: 8, pb: 8 }}>
            <CheckCircleIcon
              sx={{
                fontSize: 64,
                color: 'hsl(142, 71%, 45%)',
                mx: 'auto',
                mb: 2,
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Merriweather, serif',
                fontWeight: 700,
                color: 'text.primary',
                mb: 1,
              }}
            >
              Obrigado pela sua avaliação!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Open Sans, sans-serif',
                color: 'text.secondary',
              }}
            >
              Sua opinião é muito importante para nós.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card
        className="animate-fade-in"
        sx={{
          maxWidth: 512,
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 2px 12px -2px hsl(213 52% 24% / 0.1)',
        }}
      >
        {/* Header com gradient */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, hsl(213, 52%, 24%) 0%, hsl(28, 52%, 28%) 100%)',
            color: 'white',
            textAlign: 'center',
            p: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              mb: 2,
            }}
          >
            <ChurchIcon sx={{ fontSize: 48 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Merriweather, serif',
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                Igreja
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Merriweather, serif',
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                Presbiteriana
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Merriweather, serif',
              fontWeight: 700,
            }}
          >
            {campaign?.name || 'Pesquisa de Satisfação'}
          </Typography>
        </Box>

        <CardContent sx={{ pt: 3, pb: 3 }}>
          {campaign?.welcomeText && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'Open Sans, sans-serif',
                  color: 'text.primary',
                  textAlign: 'left',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.6,
                }}
              >
                {campaign.welcomeText}
              </Typography>
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                Em uma escala de 0 a 10, qual a probabilidade de você recomendar este curso?
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(11, 1fr)',
                  gap: 0.5,
                }}
              >
                {[...Array(11)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Button
                      type="button"
                      onClick={() => setScore(i)}
                      sx={{
                        minWidth: 0,
                        p: 1,
                        borderRadius: 2,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        bgcolor: score === i ? getScoreColor(i) : 'rgba(245, 240, 232, 0.5)',
                        color: score === i ? 'white' : 'text.primary',
                        '&:hover': {
                          bgcolor: score === i ? getScoreColor(i) : 'rgba(245, 240, 232, 0.8)',
                        },
                      }}
                    >
                      {i}
                    </Button>
                    <Typography
                      sx={{
                        fontSize: '1.2rem',
                        opacity: 1,
                      }}
                    >
                      {getScoreEmoji(i)}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 2,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'Open Sans, sans-serif',
                    color: 'text.secondary',
                  }}
                >
                  Nada provável
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'Open Sans, sans-serif',
                    color: 'text.secondary',
                  }}
                >
                  Muito provável
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Comentário (opcional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Compartilhe sua experiência..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'Open Sans, sans-serif',
                  },
                }}
              />
            </Box>

            {campaign?.questions && campaign.questions.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'Open Sans, sans-serif',
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  Perguntas Adicionais
                </Typography>
                {campaign.questions.map((question) => (
                  <Box key={question.id} sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'Open Sans, sans-serif',
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      {question.text}
                    </Typography>
                    {question.type === 'yes-no' ? (
                      <RadioGroup
                        row
                        value={
                          answers[question.id] !== undefined ? String(answers[question.id]) : ''
                        }
                        onChange={(e) =>
                          setAnswers({ ...answers, [question.id]: e.target.value === 'true' })
                        }
                      >
                        <FormControlLabel
                          value="true"
                          control={<Radio />}
                          label={
                            <Typography sx={{ fontFamily: 'Open Sans, sans-serif' }}>
                              Sim
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          value="false"
                          control={<Radio />}
                          label={
                            <Typography sx={{ fontFamily: 'Open Sans, sans-serif' }}>
                              Não
                            </Typography>
                          }
                        />
                      </RadioGroup>
                    ) : (
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={(answers[question.id] as string) || ''}
                        onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                        placeholder="Sua resposta..."
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            fontFamily: 'Open Sans, sans-serif',
                          },
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            )}

            <Box
              sx={{
                mb: 3,
                p: 2,
                bgcolor: 'hsl(40, 33%, 96%)',
                borderRadius: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={wantsToIdentify}
                    onChange={(e) => setWantsToIdentify(e.target.checked)}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontFamily: 'Open Sans, sans-serif',
                      fontSize: '0.875rem',
                    }}
                  >
                    Desejo me identificar (opcional)
                  </Typography>
                }
              />

              {wantsToIdentify && (
                <Box className="animate-fade-in" sx={{ mt: 2, display: 'grid', gap: 2 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'Open Sans, sans-serif',
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      Nome completo
                    </Typography>
                    <TextField
                      fullWidth
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome completo"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontFamily: 'Open Sans, sans-serif',
                        },
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'Open Sans, sans-serif',
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      Email
                    </Typography>
                    <TextField
                      fullWidth
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontFamily: 'Open Sans, sans-serif',
                        },
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              startIcon={<SendIcon />}
              sx={{
                py: 1.5,
                fontFamily: 'Open Sans, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              Enviar Avaliação
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NpsCampaign;
