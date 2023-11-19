import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

import { AirportService } from './airport.service';
import { AirportEntity } from './airport.entity';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<AirportEntity>;
  let airportList: AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<AirportEntity>>(getRepositoryToken(AirportEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airportList = [];
    for (let i = 0; i < 5; i++) {
      const airport: AirportEntity = await repository.save({
        name: faker.airline.airport().name,
        code: faker.string.alpha({length:3, casing:'upper'}),
        country: faker.location.country(),
        city:faker.location.city(),        
      });
      airportList.push(airport);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airports', async () => {
    const airports: AirportEntity[] = await service.findAll();
    expect(airports).not.toBeNull();
    expect(airports).toHaveLength(airportList.length);
  });

  it('findOne should return a airport by id', async () => {
    const storedAirport: AirportEntity = airportList[0];
    const airport: AirportEntity = await service.findOne(storedAirport.id);
    expect(airport).not.toBeNull();
    expect(airport.name).toEqual(storedAirport.name)
    expect(airport.code).toEqual(storedAirport.code)
    expect(airport.country).toEqual(storedAirport.country)
    expect(airport.city).toEqual(storedAirport.city)
    
  });

  it('findOne should throw an exception for an invalid airport', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });

  it('create should return a new airport', async () => {
    const airport: AirportEntity = {
      id: "",
      name: faker.airline.airport().name,
      code: faker.string.alpha({length:3, casing:'upper'}),
      country: faker.location.country(),
      city:faker.location.city(),
      airlines: [],
    }

    const newAirport: AirportEntity = await service.create(airport);
    expect(newAirport).not.toBeNull();

    const storedAirport: AirportEntity = await repository.findOne({where: {id: newAirport.id}})
    expect(storedAirport).not.toBeNull();
    expect(airport).not.toBeNull();
    expect(airport.name).toEqual(storedAirport.name)
    expect(airport.code).toEqual(storedAirport.code)
    expect(airport.country).toEqual(storedAirport.country)
    expect(airport.city).toEqual(storedAirport.city)
  });

  it('update should modify a cultura gastronomica', async () => {
    const airport: AirportEntity = airportList[0];
    airport.name = "New Airport Name";
    airport.city = "New Airport City";
    airport.country = "New Airport Country";
    airport.city = "ABC"
  
    const updatedAirport: AirportEntity = await service.update(airport.id, airport);
    expect(updatedAirport).not.toBeNull();
  
    const storedAirport: AirportEntity = await repository.findOne({ where: { id: airport.id } })
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toEqual(airport.name)
    expect(storedAirport.code).toEqual(airport.code)
    expect(storedAirport.city).toEqual(airport.city)
    expect(storedAirport.country).toEqual(airport.country)

  });
 
  it('update should throw an exception for an invalid airport', async () => {
    let airport: AirportEntity = airportList[0];
    airport = {
      ...airport, name : "New Airport Name",
      city : "New Airport City",
      country : "New Airport Country",
      code : "ABC"
    }
    await expect(() => service.update("0", airport)).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });

  it('delete should remove a airport', async () => {
    const airport: AirportEntity = airportList[0];
    await service.delete(airport.id);
  
    const deletedAirport: AirportEntity = await repository.findOne({ where: { id: airport.id } })
    expect(deletedAirport).toBeNull();
  });

  it('delete should throw an exception for an invalid airport', async () => {
    const airport: AirportEntity = airportList[0];
    await service.delete(airport.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });
 
});
