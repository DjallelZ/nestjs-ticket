import * as rawbody from 'raw-body';
import { Body, Controller, Post, Req } from "@nestjs/common";
import { TicketService } from "./ticket.service";

@Controller('ticket')
//@Controller('ticket')
export class TicketController {
  constructor(private ticketsService: TicketService) {}

  @Post()
  async processTicket(@Body() body, @Req() req) {
    if (req.readable) {
      // Le corps est ignoré par NestJS -> Il faut obtenir le body brut à partir de la requête
      const rawData = await rawbody(req);
      // Conversion en string puis suppression des espaces blancs aux extrémités
      const ticketString = rawData.toString().trim();

      // Split du payload pour récupérer la partie ticket et la partie produit dans un tableau
      let ticketParts: string[] = ticketString.split('\r\n\r\n');
      // Partie attribus du ticket
      let ticketAttributes: string = ticketParts[0];
      // Partie produits du ticket
      let ticketProducts: string = ticketParts[1];

      console.log(this.ticketsService.processTicketInsertion(ticketAttributes));
      console.log(this.ticketsService.processProductsInsertion(ticketProducts))
    }
  }
}
