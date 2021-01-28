/** @format */

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export type StorageLinkJsonColumn = {
  [key: string]: any;
};

@Entity()
export class StorageLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 200,
    default: '',
  })
  searchKey: string;

  @Column({
    length: 200,
    default: '',
  })
  uri: string;

  @Column({
    length: 200,
    default: '',
  })
  name: string;

  @Column({
    length: 200,
    default: '',
  })
  contentType: string;

  @Column('json')
  metaData: StorageLinkJsonColumn;

  @Column({
    default: false,
  })
  canViewOnlyAdmin: boolean;

  @Column({
    default: new Date(),
  })
  createdAt: Date;
}
