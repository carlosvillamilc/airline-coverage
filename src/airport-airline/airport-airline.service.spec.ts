import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

import { AirlineEntity } from '../airline/airline.entity'; 
import { AirportEntity } from '../airport/airport.entity'; 
import { AirportAirlineService } from './airport-airline.service';

describe('AirportAirlineService', () => {
  let service: AirportAirlineService;
  let airlineRepository: Repository<AirlineEntity>;
  let airportRepository: Repository<AirportEntity>;
  let airline: AirlineEntity;
  let airportList: AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportAirlineService],
    }).compile();

    service = module.get<AirportAirlineService>(AirportAirlineService);
    airportRepository = module.get<Repository<AirportEntity>>(getRepositoryToken(AirportEntity));
    airlineRepository = module.get<Repository<AirlineEntity>>(getRepositoryToken(AirlineEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await airportRepository.clear();
    await airlineRepository.clear();

    airline = await airlineRepository.save({
      name: faker.airline.airline().name,
      description: faker.lorem.sentence(),
      founding_date: faker.date.past(),
      web_site: faker.internet.url(),
    });
  
    airportList = [];
    for (let i = 0; i < 5; i++) {
      const airport: AirportEntity = await airportRepository.save({
        name: faker.airline.airport().name,
        code: faker.string.alpha({length:3, casing:'upper'}),
        country: faker.location.country(),
        city:faker.location.city(),        
      });
      airportList.push(airport);
    }    
    airline.airports = airportList;
    await airlineRepository.save(airline);
  };

  it('addAirportToAirline should add a airport to a airline', async () => {
    const newAirport = await airportRepository.save({
      name: faker.airline.airport().name,
      code: faker.string.alpha({length:3, casing:'upper'}),
      country: faker.location.country(),
      city:faker.location.city(),
    });
  
    const newAirline: AirlineEntity = await airlineRepository.save({
      name: faker.airline.airline().name,
      description: faker.lorem.sentence(),
      founding_date: faker.date.past(),
      web_site: faker.internet.url(),
    });
  
    const result: AirlineEntity = await service.addAirportToAirline(newAirport.id, newAirline.id);
    
    expect(result.airports.length).toBe(1);
    expect(result.airports[0].id).toBe(newAirport.id);
  });

  it('addAirportToAirline should throw an exception for a non-existent airline', async () => {
    const newAirport: AirportEntity = airportList[0];    
    await expect(service.addAirportToAirline(newAirport.id, "7f29b477-ba35-44a6-aa12-d163721af71c")).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('findAirportsFromAirline should return airports from a airline', async () => {
    const airports: AirportEntity[] = await service.findAirportsFromAirline(airline.id);
    expect(airports.length).toBeGreaterThan(0);
  });

  it('findAirportsFromAirline should throw an exception for a non-existent airline', async () => {
    await expect(service.findAirportsFromAirline("7f29b477-ba35-44a6-aa12-d163721af71c")).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('addAirportToAirline should throw an exception for a non-existent airport', async () => {
    await expect(service.addAirportToAirline("7f29b477-ba35-44a6-aa12-d163721af71c", airline.id)).rejects.toHaveProperty("message", "The airport with the given id was not found");
  });

  it('findAirportFromAirline should throw an exception for a non-existent airline', async () => {
    const airport: AirportEntity = airportList[0];
    await expect(service.findAirportFromAirline(airport.id, "7f29b477-ba35-44a6-aa12-d163721af71c")).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('findAirportFromAirline should return a specific airport from a airline', async () => {
    const airport: AirportEntity = airportList[0];
    const foundAirport: AirportEntity = await service.findAirportFromAirline(airport.id, airline.id);
    expect(foundAirport).not.toBeNull();
    expect(foundAirport.id).toBe(airport.id);
  });


  it('updateAirportsFromAirline should update airports for a airline', async () => {
    const newAirportList = [];
    const updatedAirline: AirlineEntity = await service.updateAirportsFromAirline(airline.id, newAirportList.map(airport => airport.id));
    expect(updatedAirline.airports.length).toBe(newAirportList.length);
  });

  it('updateAirportsFromAirline should throw an exception for a non-existent airline', async () => {
    const newAirportList = [airportList[0].id];
    await expect(service.updateAirportsFromAirline("7f29b477-ba35-44a6-aa12-d163721af71c", newAirportList)).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('deleteAirportFromAirline should remove a airport from a airline', async () => {
    const airportToRemove: AirportEntity = airportList[0];
    
    await service.deleteAirportFromAirline(airportToRemove.id, airline.id);
  
    const updatedAirline: AirlineEntity = await airlineRepository.findOne({ where: { id: airline.id }, relations: ["airports"] });
    expect(updatedAirline.airports.find(airport => airport.id === airportToRemove.id)).toBeUndefined();
  });

  it('deleteAirportFromAirline should throw an exception for a non-existent airport', async () => {
    const airport: AirportEntity = airportList[0];
    await expect(service.deleteAirportFromAirline( airport.id, "7f29b477-ba35-44a6-aa12-d163721af71c")).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });
});