import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/clubs (GET)', () => {
    return request(app.getHttpServer())
      .get('/clubs?season=17')
      .expect(200)
      .expect(function(res) {
        const data = res.body;
        console.log(data)

        expect(typeof data).toBe('array');
        expect(data.length).not.toBeLessThan(10);
      });

  });
});
