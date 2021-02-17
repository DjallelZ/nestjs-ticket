import { EntityRepository, Repository } from "typeorm";
import { RawTicket } from "./raw-ticket.entity";

@EntityRepository(RawTicket)
export class RawTicketRepository extends Repository<RawTicket> {

}