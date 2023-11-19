import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirlineModule } from './airline/airline.module';
import { AirportModule } from './airport/airport.module';
import { AirlineEntity } from './airline/airline.entity';
import { AirportEntity } from './airport/airport.entity';
import { AirportAirlineModule } from './airport-airline/airport-airline.module';

@Module({
  imports: [AirlineModule, 
    AirportModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'airline-coverage',
      entities: [AirlineEntity, AirportEntity,],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    AirportAirlineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
