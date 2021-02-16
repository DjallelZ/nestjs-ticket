import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Product extends BaseEntity {
  @PrimaryColumn()
  product_id: string;
  @Column()
  product: string;
  @Column()
  price: number;

  constructor(product_id: string, product: string, price: number) {
    super();
    this.product_id = product_id;
    this.product = product;
    this.price = price;
  }
}
