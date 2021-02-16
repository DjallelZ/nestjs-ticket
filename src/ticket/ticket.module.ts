import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketRepository } from "./ticket.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketRepository])
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
