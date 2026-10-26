import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      name: 'BrewLite API',
      status: 'running',
      version: '1.0.0',
      message: 'Hello World from BrewLite API!',
      webUrl: 'http://localhost:3000',
      endpoints: {
        hello: '/',
        health: '/health',
        products: '/products',
        productDetail: '/products/:id',
      },
    };
  }

  getHealth() {
    return {
      status: 'ok',
      service: 'brewlite-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
