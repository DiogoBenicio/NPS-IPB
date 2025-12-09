const express = require('express');
// crypto not used; removing to satisfy lint
const prisma = require('../prisma');
const logger = require('../logger');

const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Admin auth middleware for export
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Submit response (public)
router.post('/', async (req, res, next) => {
  try {
    const { campaignId, name, email, score, comment, answers } = req.body;

    logger.info('Creating response', {
      campaignId,
      hasName: !!name,
      hasEmail: !!email,
      name,
      email,
      score,
      requestId: req.id,
    });

    if (score < 0 || score > 10) {
      return res.status(400).json({ error: 'Score must be between 0 and 10' });
    }

    const responseData = {
      campaign: { connect: { id: campaignId } },
      score: parseInt(score),
      comment: comment || null,
      answers: answers || null,
    };

    // Só adiciona name e email se foram fornecidos
    if (name && name.trim()) {
      responseData.name = name.trim();
    }
    if (email && email.trim()) {
      responseData.email = email.trim();
    }

    logger.info('Response data to save', { responseData, requestId: req.id });

    const response = await prisma.response.create({
      data: responseData,
    });

    logger.info('Response created successfully', { responseId: response.id, requestId: req.id });

    res.status(201).json(response);
  } catch (error) {
    logger.error('responses_create_error', {
      message: error.message,
      stack: error.stack,
      requestId: req.id,
      body: req.body,
    });
    next(error);
  }
});

// Get responses for dashboard (auth)
router.get('/', async (req, res, next) => {
  try {
    // For simplicity, no auth here; add if needed
    const responses = await prisma.response.findMany({
      include: { campaign: true },
    });
    res.json(responses);
  } catch (error) {
    logger.error('responses_get_error', {
      message: error.message,
      stack: error.stack,
      requestId: req.id,
    });
    next(error);
  }
});

// Get NPS stats for a campaign
router.get('/stats/:campaignId', async (req, res, next) => {
  try {
    const { campaignId } = req.params;

    const responses = await prisma.response.findMany({ where: { campaignId } });

    const promoters = responses.filter((r) => r.score >= 9).length;
    const passives = responses.filter((r) => r.score >= 7 && r.score <= 8).length;
    const detractors = responses.filter((r) => r.score <= 6).length;
    const total = responses.length;
    const averageScore = total > 0 ? responses.reduce((sum, r) => sum + r.score, 0) / total : 0;

    const nps = total > 0 ? ((promoters - detractors) / total) * 100 : 0;

    res.json({
      totalResponses: total,
      averageScore: Math.round(averageScore * 100) / 100,
      npsScore: Math.round(nps),
      promoters,
      passives,
      detractors,
    });
  } catch (error) {
    logger.error('responses_stats_error', {
      message: error.message,
      stack: error.stack,
      requestId: req.id,
      params: req.params,
    });
    next(error);
  }
});

// Export all responses as CSV (auth required)
router.get('/export', auth, async (req, res, next) => {
  try {
    const responses = await prisma.response.findMany({ include: { campaign: true } });
    const headers = [
      'id',
      'campaignId',
      'campaignName',
      'name',
      'email',
      'score',
      'comment',
      'createdAt',
    ];
    const csvRows = responses.map((r) => {
      const safe = (v) => `"${String(v || '').replace(/"/g, '""')}"`;
      return [
        r.id,
        r.campaignId,
        r.campaign?.name || '',
        r.name || '',
        r.email || '',
        r.score,
        r.comment || '',
        r.createdAt.toISOString(),
      ]
        .map(safe)
        .join(',');
    });
    const csv = [headers.join(','), ...csvRows].join('\n');
    res.setHeader('Content-Disposition', 'attachment; filename="responses.csv"');
    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);
  } catch (error) {
    logger.error('responses_export_error', {
      message: error.message,
      stack: error.stack,
      requestId: req.id,
    });
    next(error);
  }
});

module.exports = router;
