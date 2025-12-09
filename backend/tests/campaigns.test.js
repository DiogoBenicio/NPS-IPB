const request = require('supertest');
const app = require('../index');

describe('Campaigns API', () => {
  let token;

  beforeAll(async () => {
    // Ensure admin exists
    await request(app).post('/api/auth/register').send({ username: 'admin', password: 'password' });

    // Login to get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'password' });
    token = res.body.token;
  });

  it('should create a campaign', async () => {
    const res = await request(app)
      .post('/api/campaigns')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Campaign',
        description: 'A test NPS campaign',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Campaign');
  });

  it('should get campaigns', async () => {
    const res = await request(app).get('/api/campaigns').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should update a campaign', async () => {
    // First create a campaign
    const createRes = await request(app)
      .post('/api/campaigns')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Update Test',
        description: 'To be updated',
      });

    const campaignId = createRes.body.id;

    const res = await request(app)
      .put(`/api/campaigns/${campaignId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Campaign',
        description: 'Updated description',
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Campaign');
  });

  it('should delete a campaign', async () => {
    // First create a campaign
    const createRes = await request(app)
      .post('/api/campaigns')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Delete Test',
        description: 'To be deleted',
      });

    const campaignId = createRes.body.id;

    const res = await request(app)
      .delete(`/api/campaigns/${campaignId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Campaign deleted');
  });
});
