import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketRepository } from "./ticket.repository";
import { ProductRepository } from "../product/product.repository";
import { RawTicketRepository } from "../raw-ticket/raw-ticket.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketRepository]),
    TypeOrmModule.forFeature([ProductRepository]),
    TypeOrmModule.forFeature([RawTicketRepository])
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
