import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Ticket extends BaseEntity {
  @PrimaryColumn()
  order: number;
  @Column("float")
  vat: number;
  @Column("float")
  total: number;

  constructor(order: number, vat: number, total: number) {
    super();
    this.order = order;
    this.vat = vat;
    this.total = total;
  }

}