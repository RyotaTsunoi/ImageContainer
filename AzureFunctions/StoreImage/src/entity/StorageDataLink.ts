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
  meta_1: string;

  @Column({
    length: 200,
    default: '',
  })
  meta_2: string;

  @Column({
    length: 200,
    default: '',
  })
  meta_3: string;

  @Column({
    length: 200,
    default: '',
  })
  meta_4: string;

  @Column({
    length: 200,
    default: '',
  })
  meta_5: string;

  @Column('text', {
    default: '',
  })
  meta_6_ocr_result: string;

  @Column({
    default: true,
  })
  is_admin_only: boolean;

  @Column({
    default: '2021-02-01',
  })
  created_at: string;
}
