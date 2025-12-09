const request = require('supertest');
const app = require('../index');

describe('Responses API', () => {
  let token;
  let campaignId;

  beforeAll(async () => {
    // Ensure admin exists
    await request(app).post('/api/auth/register').send({ username: 'admin', password: 'password' });

    // Login to get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'password' });
    token = res.body.token;
    console.log('Token obtained:', token);

    // Create a campaign for testing
    const campaignRes = await request(app)
      .post('/api/campaigns')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Response Test Campaign',
        description: 'For testing responses',
      });
    campaignId = campaignRes.body.id;
    console.log('Campaign created:', campaignId);
  });

  it('should submit a response', async () => {
    const res = await request(app).post('/api/responses').send({
      campaignId,
      name: 'John Doe',
      email: 'john@example.com',
      score: 9,
      comment: 'Great service!',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.score).toBe(9);
  });

  it('should get campaign stats', async () => {
    // Submit a few more responses
    await request(app).post('/api/responses').send({
      campaignId,
      name: 'Jane Doe',
      email: 'jane@example.com',
      score: 7,
      comment: 'Good',
    });

    await request(app).post('/api/responses').send({
      campaignId,
      name: 'Bob Smith',
      email: 'bob@example.com',
      score: 3,
      comment: 'Needs improvement',
    });

    const res = await request(app)
      .get(`/api/responses/stats/${campaignId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalResponses');
    expect(res.body).toHaveProperty('averageScore');
    expect(res.body).toHaveProperty('npsScore');
    expect(res.body.totalResponses).toBe(3);
  });

  it('should reject invalid score', async () => {
    const res = await request(app).post('/api/responses').send({
      campaignId,
      name: 'Invalid User',
      email: 'invalid@example.com',
      score: 15, // Invalid score
      comment: 'Test',
    });

    expect(res.status).toBe(400);
  });
});
