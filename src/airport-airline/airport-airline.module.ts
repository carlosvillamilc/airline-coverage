import { Module } from '@nestjs/common';
import { AirportAirlineService } from './airport-airline.service';

@Module({
  providers: [AirportAirlineService]
})
export class AirportAirlineModule {}
