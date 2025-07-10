import {
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  
  export abstract class BaseTable {
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt!: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt!: Date;

    @DeleteDateColumn({name: 'deleted_at', nullable: true})  
    deletedAt?: Date;

  }