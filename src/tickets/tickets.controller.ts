import * as rawbody from 'raw-body';
import { Body, Controller, Post, Req } from "@nestjs/common";
import { TicketsService } from "./tickets.service";

@Controller('ticket')
//@Controller('ticket')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  async processTicket(@Body() body, @Req() req) {
    if (req.readable) {
      // Le corps est ignoré par NestJS -> Il faut obtenir le body brut à partir de la requête
      const rawData = await rawbody(req);
      // Conversion en string puis suppression des espaces blancs aux extrémités
      const ticketString = rawData.toString().trim();

      this.ticketsService.processTicketInsertion(ticketString);
    }
  }
}
