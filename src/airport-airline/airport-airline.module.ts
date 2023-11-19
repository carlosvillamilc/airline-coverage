import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AirportAirlineService } from './airport-airline.service';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { AirportAirlineController } from './airport-airline.controller';

@Module({
  providers: [AirportAirlineService],
  imports: [TypeOrmModule.forFeature([AirlineEntity, AirportEntity])],
  controllers: [AirportAirlineController],

})
export class AirportAirlineModule {}
