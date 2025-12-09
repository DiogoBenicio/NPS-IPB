const request = require('supertest');
const app = require('../index');

describe('Auth API', () => {
  beforeEach(async () => {
    // Clean up
    await global.prisma.user.deleteMany();
  });

  afterAll(async () => {
    await global.prisma.$disconnect();
  });

  it('should register first admin', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'admin', password: 'password' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Admin registered');
  });

  it('should not register second admin', async () => {
    await global.prisma.user.create({
      data: { username: 'admin', password: 'hash' },
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'admin2', password: 'password' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Admin already exists');
  });

  it('should login admin', async () => {
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash('password', 10);
    await global.prisma.user.create({
      data: { username: 'admin', password: hashed },
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'password' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
