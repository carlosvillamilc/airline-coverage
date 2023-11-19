import { Test, TestingModule } from '@nestjs/testing';
import { AirportAirlineService } from './airport-airline.service';

describe('AirportAirlineService', () => {
  let service: AirportAirlineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirportAirlineService],
    }).compile();

    service = module.get<AirportAirlineService>(AirportAirlineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
