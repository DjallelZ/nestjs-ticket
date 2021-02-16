import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Ticket extends BaseEntity {
  @PrimaryColumn()
  order: number;
  @Column()
  vat: number;
  @Column()
  total: number;
}