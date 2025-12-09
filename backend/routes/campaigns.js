const express = require('express');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');
const logger = require('../logger');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Middleware auth
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    logger.warn('invalid_token', { message: err.message, requestId: req.id });
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all campaigns
router.get('/', auth, async (req, res, next) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: { _count: { select: { responses: true } } },
    });
    res.json(campaigns);
  } catch (error) {
    logger.error('campaigns_get_error', {
      message: error.message,
      stack: error.stack,
      requestId: req.id,
    });
    next(error);
  }
});

// Create campaign
router.post('/', auth, async (req, res, next) => {
  try {
    const { name, description, welcomeText, questions } = req.body;
    const campaign = await prisma.campaign.create({
      data: { name, description, welcomeText, questions },
    });

    // Set a QR URL for the campaign; use configured BASE_URL if provided, otherwise relative path
    const baseUrl = process.env.BASE_URL || '';
    const qrCodeUrl = baseUrl
      ? `${baseUrl.replace(/\/$/, '')}/campaign/${campaign.id}`
      : `/campaign/${campaign.id}`;
    await prisma.campaign.update({ where: { id: campaign.id }, data: { qrCodeUrl } });
    campaign.qrCodeUrl = qrCodeUrl;
    res.status(201).json(campaign);
  } catch (error) {
    logger.error('campaigns_create_error', {
      message: error.message,
      stack: error.stack,
      requestId: req.id,
      body: req.body,
    });
    next(error);
  }
});

// Get campaign by id (PUBLIC - for survey page)
router.get('/public/:id', async (req, res, next) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.id },
    });
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    if (!campaign.isActive) return res.status(403).json({ error: 'Campaign is not active' });

    // Return only necessary fields
    const publicCampaign = {
      id: campaign.id,
      name: campaign.name,
      welcomeText: campaign.welcomeText,
      questions: campaign.questions,
      isActive: campaign.isActive,
    };

    res.json(publicCampaign);
  } catch (error) {
    logger.error('campaigns_getByIdPublic_error', {
      message: error.message,
      stack: error.stack,
      requestId: req.id,
      params: req.params,
    });
    next(error);
  }
});

// Get campaign by id (auth)
router.get('/:id', auth, async (req, res, next) => {
  try {
    const campaign = await prisma.campaign.findUnique({ where: { id: req.params.id } });
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (error) {
    logger.error('campaigns_getById_error', {
      message: error.message,
      stack: error.stack,
      requestId: req.id,
      params: req.params,
    });
    next(error);
  }
});

// Update campaign
router.put('/:id', auth, async (req, res, next) => {
  try {
    const { name, description, welcomeText, isActive, questions } = req.body;
    const campaign = await prisma.campaign.update({
      where: { id: req.params.id },
      data: { name, description, welcomeText, isActive, questions },
    });
    res.json(campaign);
  } catch (error) {
    logger.error('campaigns_update_error', {
      message: error.message,
      stack: error.stack,
      requestId: req.id,
      params: req.params,
      body: req.body,
    });
    next(error);
  }
});

// Delete campaign
router.delete('/:id', auth, async (req, res, next) => {
  try {
    await prisma.campaign.delete({ where: { id: req.params.id } });
    res.json({ message: 'Campaign deleted' });
  } catch (error) {
    logger.error('campaigns_delete_error', {
      message: error.message,
      stack: error.stack,
      requestId: req.id,
      params: req.params,
    });
    next(error);
  }
});

// Cleaned up stray lines from previous edit
module.exports = router;
