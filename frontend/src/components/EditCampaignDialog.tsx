import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface Question {
  id: string;
  text: string;
  type: 'yes-no' | 'text';
}

interface Campaign {
  id: string;
  name: string;
  welcomeText?: string;
  questions?: Question[];
}

interface EditCampaignDialogProps {
  open: boolean;
  campaign: Campaign | null;
  onClose: () => void;
  onSubmit: (id: string, name: string, welcomeText: string, questions: Question[]) => void;
  loading?: boolean;
}

const EditCampaignDialog: React.FC<EditCampaignDialogProps> = ({
  open,
  campaign,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [name, setName] = React.useState('');
  const [welcomeText, setWelcomeText] = React.useState('');
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [newQuestionText, setNewQuestionText] = React.useState('');
  const [newQuestionType, setNewQuestionType] = React.useState<'yes-no' | 'text'>('yes-no');

  useEffect(() => {
    if (campaign) {
      setName(campaign.name);
      setWelcomeText(campaign.welcomeText || '');
      setQuestions(campaign.questions || []);
    }
  }, [campaign]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (campaign && name.trim() && welcomeText.trim()) {
      onSubmit(campaign.id, name.trim(), welcomeText.trim(), questions);
      handleClose();
    }
  };

  const handleClose = () => {
    setName('');
    setWelcomeText('');
    setQuestions([]);
    setNewQuestionText('');
    setNewQuestionType('yes-no');
    onClose();
  };

  const handleAddQuestion = () => {
    if (newQuestionText.trim()) {
      setQuestions([
        ...questions,
        {
          id: Date.now().toString(),
          text: newQuestionText.trim(),
          type: newQuestionType,
        },
      ]);
      setNewQuestionText('');
      setNewQuestionType('yes-no');
    }
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleMoveQuestionUp = (index: number) => {
    if (index === 0) return;
    const newQuestions = [...questions];
    [newQuestions[index - 1], newQuestions[index]] = [newQuestions[index], newQuestions[index - 1]];
    setQuestions(newQuestions);
  };

  const handleMoveQuestionDown = (index: number) => {
    if (index === questions.length - 1) return;
    const newQuestions = [...questions];
    [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
    setQuestions(newQuestions);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
          Editar Campanha
        </Typography>
        <IconButton onClick={handleClose} size="small" aria-label="Fechar">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Nome da Campanha"
              placeholder="Ex: Pesquisa de Satisfação 2024"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              autoFocus
              disabled={loading}
            />

            <TextField
              label="Mensagem de Boas-Vindas"
              placeholder="Ex: Queremos ouvir sua opinião sobre nossos serviços..."
              value={welcomeText}
              onChange={(e) => setWelcomeText(e.target.value)}
              fullWidth
              required
              multiline
              rows={4}
              disabled={loading}
              helperText="Esta mensagem será exibida aos participantes antes de avaliarem"
            />

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Perguntas Customizadas (Opcional)
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Texto da Pergunta"
                  placeholder="Ex: Você recomendaria para um amigo?"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  fullWidth
                  disabled={loading}
                  size="small"
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={newQuestionType}
                    label="Tipo"
                    onChange={(e) => setNewQuestionType(e.target.value as 'yes-no' | 'text')}
                    disabled={loading}
                  >
                    <MenuItem value="yes-no">Sim/Não</MenuItem>
                    <MenuItem value="text">Texto</MenuItem>
                  </Select>
                </FormControl>
                <IconButton
                  color="primary"
                  onClick={handleAddQuestion}
                  disabled={loading || !newQuestionText.trim()}
                >
                  <AddIcon />
                </IconButton>
              </Box>

              {questions.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {questions.map((q, index) => (
                    <Box
                      key={q.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1.5,
                        bgcolor: 'hsl(40, 33%, 96%)',
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleMoveQuestionUp(index)}
                          disabled={loading || index === 0}
                          sx={{ padding: '2px' }}
                        >
                          <ArrowUpwardIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleMoveQuestionDown(index)}
                          disabled={loading || index === questions.length - 1}
                          sx={{ padding: '2px' }}
                        >
                          <ArrowDownwardIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                      </Box>
                      <Typography sx={{ flex: 1, fontSize: '0.875rem' }}>{q.text}</Typography>
                      <Chip
                        label={q.type === 'yes-no' ? 'Sim/Não' : 'Texto'}
                        size="small"
                        sx={{ fontSize: '0.75rem' }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveQuestion(q.id)}
                        disabled={loading}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{
              '&:focus, &:focus-visible': {
                outline: 'none',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !name.trim() || !welcomeText.trim()}
            sx={{
              '&:focus, &:focus-visible': {
                outline: 'none',
              },
            }}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditCampaignDialog;
