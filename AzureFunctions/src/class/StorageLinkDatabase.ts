/** @format */

import { Connection, createConnection, ConnectionOptions, Repository } from 'typeorm';
import { StorageLink, StorageLinkJsonColumn } from '../entity/StorageLink';
import 'reflect-metadata';

export type StorageLinkInsertData = {
  searchKey: string;
  uri: string;
  name: string;
  contentType: string;
  metaData?: StorageLinkJsonColumn;
  canViewOnlyAdmin?: boolean;
  createdAt?: Date;
};

export class StorageLinkDatabase {
  private readonly connection: Connection;
  private readonly repository: Repository<StorageLink>;

  constructor(connection: Connection) {
    this.connection = connection;
    this.repository = connection.getRepository(StorageLink);
  }

  static async create(): Promise<StorageLinkDatabase> {
    const connectionOptions: ConnectionOptions = {
      type: 'postgres',
      host: process.env.DATABASE_CONNECTION_HOST,
      port: 5432,
      username: process.env.DATABASE_CONNECTION_USERNAME,
      password: process.env.DATABASE_CONNECTION_PASSWORD,
      database: 'postgres',
      entities: [StorageLink],
      synchronize: true,
      ssl: false,
    };
    const connection = await createConnection(connectionOptions);
    return new StorageLinkDatabase(connection);
  }

  buildInsertRepositoryData(storageLinkInsertData: StorageLinkInsertData, storageLink: StorageLink): StorageLink {
    storageLink.searchKey = storageLinkInsertData.searchKey;
    storageLink.uri = storageLinkInsertData.uri;
    storageLink.name = storageLinkInsertData.name;
    storageLink.contentType = storageLinkInsertData.contentType;
    storageLink.metaData = storageLinkInsertData?.metaData;
    storageLink.canViewOnlyAdmin = storageLinkInsertData?.canViewOnlyAdmin;
    storageLink.createdAt = storageLinkInsertData?.createdAt;
    return storageLink;
  }

  async insertData(storageLinkInsertData: StorageLinkInsertData): Promise<void> {
    const storageLink = this.buildInsertRepositoryData(storageLinkInsertData, new StorageLink());
    await this.repository.save(storageLink);
    await this.connection.close();
  }
}
