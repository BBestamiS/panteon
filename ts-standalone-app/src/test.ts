// src/test.ts

import mysql, { Connection, RowDataPacket } from 'mysql2/promise';
import config from './config.js';

async function testConnection() {
  const connection: Connection = await mysql.createConnection(config.db);
  console.log('Connection established.');

  const [rows] = await connection.query<RowDataPacket[]>('SELECT 1 + 1 AS solution');
  console.log('The solution is: ', rows[0].solution);

  await connection.end();
}

testConnection().catch(console.error);
