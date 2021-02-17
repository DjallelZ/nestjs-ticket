import * as rawbody from 'raw-body';
import { Body, Controller, Post, Req } from "@nestjs/common";
import { TicketService } from "./ticket.service";

@Controller('ticket')
export class TicketController {
  constructor(private ticketsService: TicketService) {}

  @Post()
  async processTicket(@Req() req) {
    if (req.readable) {
      // Le corps est ignoré par NestJS -> Il faut obtenir le body brut à partir de la requête
      const rawData = await rawbody(req);
      const ticketString = rawData.toString().trim();

      try {
        return this.ticketsService.processTicket(ticketString);
      } catch (error) {
        this.ticketsService.processRawTicket(rawData.toString());
        return(error);
      }
    }
  }
}
