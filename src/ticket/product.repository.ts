import { EntityRepository, Repository } from "typeorm";
import { Product } from "./product.entity";

@EntityRepository(Product)
export class TicketRepository extends Repository<Product> {

}