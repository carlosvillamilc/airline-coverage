import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AirportAirlineService } from './airport-airline.service';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';

@Module({
  providers: [AirportAirlineService],
  imports: [TypeOrmModule.forFeature([AirlineEntity, AirportEntity])],

})
export class AirportAirlineModule {}
