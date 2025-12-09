import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BarChartIcon from '@mui/icons-material/BarChart';
import QrCodeIcon from '@mui/icons-material/QrCode';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QRCode from 'qrcode';
import type { Campaign } from '../types/campaign';

interface CampaignCardProps {
  campaign: Campaign;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onDelete,
  onEdit,
  onViewDetails,
}) => {
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const generateQRCode = async () => {
    const surveyUrl = `${window.location.origin}/survey/${campaign.id}`;
    try {
      const url = await QRCode.toDataURL(surveyUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1e3a5f',
          light: '#f5f0e8',
        },
      });
      setQrCodeUrl(url);
      setShowQRDialog(true);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.download = `qrcode-${campaign.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  const copyLink = async () => {
    const surveyUrl = `${window.location.origin}/survey/${campaign.id}`;
    try {
      await navigator.clipboard.writeText(surveyUrl);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
    }
  };

  const getNPSCategory = (
    score: number
  ): { label: string; color: 'error' | 'warning' | 'success' } => {
    if (score >= 75) return { label: 'Excelente', color: 'success' };
    if (score >= 50) return { label: 'Muito Bom', color: 'success' };
    if (score >= 0) return { label: 'Bom', color: 'warning' };
    return { label: 'Precisa Melhorar', color: 'error' };
  };

  const npsInfo = getNPSCategory(campaign.averageScore);

  return (
    <Card
      className="animate-fade-in shadow-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 'var(--shadow-hover)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{ fontWeight: 'bold', color: 'text.primary' }}
          >
            {campaign.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => onEdit(campaign.id)}
              sx={{ 
                color: 'primary.main',
                '&:focus, &:focus-visible': {
                  outline: 'none',
                },
              }}
              aria-label="Editar campanha"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(campaign.id)}
              sx={{ 
                color: 'error.main',
                '&:focus, &:focus-visible': {
                  outline: 'none',
                },
              }}
              aria-label="Excluir campanha"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, minHeight: 40 }}>
          {campaign.welcomeText?.substring(0, 100) || campaign.description?.substring(0, 100) || ''}
          {(campaign.welcomeText || campaign.description || '').length > 100 ? '...' : ''}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label={`${campaign.responses} respostas`} size="small" variant="outlined" />
          <Chip label={npsInfo.label} size="small" color={npsInfo.color} />
          {campaign.questions && Array.isArray(campaign.questions) && campaign.questions.length > 0 && (
            <Chip
              label={`${campaign.questions.length} ${campaign.questions.length === 1 ? 'pergunta' : 'perguntas'}`}
              size="small"
              variant="outlined"
              color="primary"
            />
          )}
        </Box>

        <Box
          sx={{
            p: 2,
            background:
              'linear-gradient(135deg, var(--gradient-navy-start), var(--gradient-navy-end))',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 0.5 }}>
            {campaign.averageScore.toFixed(1)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'white', opacity: 0.9 }}>
            NPS Médio
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<BarChartIcon />}
          onClick={() => onViewDetails(campaign.id)}
        >
          Ver Detalhes
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<QrCodeIcon />}
          onClick={generateQRCode}
        >
          QR Code
        </Button>
      </CardActions>

      {/* QR Code Dialog */}
      <Dialog
        open={showQRDialog}
        onClose={() => setShowQRDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontFamily: 'Merriweather, serif',
            fontWeight: 700,
            color: 'primary.main',
          }}
        >
          QR Code - {campaign.name}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              py: 2,
            }}
          >
            {qrCodeUrl && (
              <>
                <Box
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    boxShadow: '0 2px 12px -2px hsl(213 52% 24% / 0.1)',
                  }}
                >
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    style={{ width: 300, height: 300, borderRadius: 8 }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    textAlign: 'center',
                    fontFamily: 'Open Sans, sans-serif',
                  }}
                >
                  Escaneie o QR Code para acessar a pesquisa
                </Typography>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setShowQRDialog(false)}
            sx={{
              fontFamily: 'Open Sans, sans-serif',
              textTransform: 'none',
              '&:focus, &:focus-visible': {
                outline: 'none',
              },
            }}
          >
            Fechar
          </Button>
          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={copyLink}
            sx={{
              fontFamily: 'Open Sans, sans-serif',
              textTransform: 'none',
              '&:focus, &:focus-visible': {
                outline: 'none',
              },
            }}
          >
            Copiar Link
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={downloadQRCode}
            sx={{
              fontFamily: 'Open Sans, sans-serif',
              textTransform: 'none',
              '&:focus, &:focus-visible': {
                outline: 'none',
              },
            }}
          >
            Baixar PNG
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default CampaignCard;
