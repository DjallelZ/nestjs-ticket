import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RawTicket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  content: string;

  constructor(content: string) {
    super();
    this.content = content;
  }
}
