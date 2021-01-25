/** @format */

import { Connection, createConnection, ConnectionOptions } from 'typeorm';
import { StorageDataLink } from '../../entity/StorageDataLink';
import 'reflect-metadata';

/**
 * @class
 * @classdesc Access to Azure SQL from Azure function
 */
export class Database {
  private readonly connectionOptions: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DATABASE_CONNECTION_HOST,
    port: 5432,
    username: process.env.DATABASE_CONNECTION_USERNAME,
    password: process.env.DATABASE_CONNECTION_PASSWORD,
    database: 'postgres',
    entities: [__dirname + '\\**\\entity\\*{.ts,.js}'],
    synchronize: true,
    ssl: false,
  };

  /**
   * Database class Constractor
   * @constructor
   * @param none
   */
  constructor() {}

  /**
   * Create database connection
   * @function
   * @return {Promise<Connection>} Promise<Connection>
   */
  private async connectionBuilder(): Promise<Connection> {
    return createConnection(this.connectionOptions);
  }

  /**
   * Insert data
   * @function
   * @param {string} url blob storage url
   * @param {string} name blob name
   * @param {string} extension blob extension
   * @param {string} meta1 blob meta 1
   * @return Promise<void>
   */
  async insertData(url: string, name: string, extension: string, meta1: string): Promise<void> {
    const connection = await this.connectionBuilder();
    const repo = await connection.getRepository(StorageDataLink);
    const storageDataLink = new StorageDataLink();
    storageDataLink.blob_url = url;
    storageDataLink.blob_name = name;
    storageDataLink.blob_extension = extension;
    storageDataLink.meta_1 = meta1;
    await repo.save(storageDataLink);
    connection.close();
  }
}
