import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Ticket extends BaseEntity {
  @PrimaryColumn()
  order: number;
  @Column("float")
  vat: number;
  @Column("float")
  total: number;
  products: Product[];

  constructor(order: number, vat: number, total: number, products: Product[]) {
    super();
    this.order = order;
    this.vat = vat;
    this.total = total;
    this.products = products;
  }

}