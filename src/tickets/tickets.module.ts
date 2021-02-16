import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketRepository } from "./ticket.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketRepository])
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
