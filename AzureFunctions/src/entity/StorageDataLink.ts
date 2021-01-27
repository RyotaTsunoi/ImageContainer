/** @format */

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StorageDataLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 200,
    default: '',
  })
  search_key: string;

  @Column({
    length: 200,
    default: '',
  })
  blob_url: string;

  @Column({
    length: 200,
    default: '',
  })
  blob_name: string;

  @Column({
    length: 200,
    default: '',
  })
  blob_extension: string;

  @Column({
    length: 200,
    default: '',
  })
  metadata1: string;

  @Column('text', {
    default: '',
  })
  metadata_ocr_reslut: string;

  @Column({
    default: true,
  })
  is_admin_only: boolean;

  @Column({
    default: '2021-02-01',
  })
  created_at: Date;
}
