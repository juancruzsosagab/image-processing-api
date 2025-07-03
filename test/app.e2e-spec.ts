import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

interface TaskResponse {
  id: string;
  status: string;
  price: number;
  images?: { resolution: string; path: string }[];
}

jest.setTimeout(15000);

describe('Tasks API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a task and return taskId, status and price', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .send({ originalPath: 'input/local-image.jpg' })
      .expect(201);

    const body = res.body as TaskResponse;

    expect(body.id).toBeDefined();
    expect(body.status).toBe('pending');
    expect(typeof body.price).toBe('number');
    expect(body.price).toBeGreaterThanOrEqual(5);
    expect(body.price).toBeLessThanOrEqual(50);
  });

  it('should return pending status immediately after creation', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/tasks')
      .send({ originalPath: 'input/local-image.jpg' })
      .expect(201);

    const { id: taskId } = createRes.body as TaskResponse;

    const getRes = await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .expect(200);

    const body = getRes.body as TaskResponse;

    expect(body.id).toBe(taskId);
    expect(body.status).toBe('pending');
    expect(typeof body.price).toBe('number');
    expect(body.images).toBeUndefined();
  });

  it('should return completed status and image paths after processing', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/tasks')
      .send({ originalPath: 'input/local-image.jpg' })
      .expect(201);

    const { id: taskId } = createRes.body as TaskResponse;

    await new Promise((resolve) => setTimeout(resolve, 7000));

    const getRes = await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .expect(200);

    const body = getRes.body as TaskResponse;

    expect(body.id).toBe(taskId);
    expect(body.status).toBe('completed');
    expect(typeof body.price).toBe('number');
    expect(body.images).toBeInstanceOf(Array);
    expect(body.images!.length).toBe(2);

    for (const img of body.images!) {
      expect(['1024', '800']).toContain(img.resolution);
      expect(typeof img.path).toBe('string');
      expect(img.path).toMatch(/output\//);
    }
  });

  it('should return null for non-existent taskId', async () => {
    const fakeId = '65d4a54b89c5e342b2c2c5f6';

    const res = await request(app.getHttpServer())
      .get(`/tasks/${fakeId}`)
      .expect(404);

    expect(res.body).toHaveProperty('statusCode', 404);
    expect(res.body).toHaveProperty('error', 'Not Found');
    expect(res.body).toHaveProperty('message', `Task ${fakeId} not found`);
  });

  it('should set status to failed if path is invalid', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .send({ originalPath: 'input/imagen-inexistente.jpg' })
      .expect(201);

    const { id: taskId } = res.body as TaskResponse;

    await new Promise((resolve) => setTimeout(resolve, 7000));

    const getRes = await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .expect(200);

    const body = getRes.body as TaskResponse;

    expect(body.status).toBe('failed');
  });
});
