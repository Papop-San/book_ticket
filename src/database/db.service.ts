// src/db/db.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import 'dotenv/config';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  onModuleInit() {
   
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST ,
      database: process.env.DB_NAME ,
      password: process.env.DB_PASSWORD ,
      port: Number(process.env.DB_PORT) ,
    });
  }

  query<T = any>(text: string, params?: any[]): Promise<T[]> {
    return this.pool.query(text, params).then(res => res.rows);
  }

  async getClient() {
    return this.pool.connect();
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
