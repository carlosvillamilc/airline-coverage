import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AirportService } from './airport.service';
import { AirportEntity } from './airport.entity';
import { AirportController } from './airport.controller';

@Module({
  providers: [AirportService],
  imports: [TypeOrmModule.forFeature([AirportEntity])],
  controllers: [AirportController],

})
export class AirportModule {}
