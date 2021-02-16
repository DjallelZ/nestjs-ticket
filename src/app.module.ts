import { Module } from '@nestjs/common';
import { TicketModule } from './ticket/ticket.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./config/typeorm.config";

@Module({
  imports: [
    TicketModule,
    TypeOrmModule.forRoot(typeOrmConfig)],
})
export class AppModule {}
