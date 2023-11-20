import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

import { AirlineService } from './airline.service';
import { AirlineEntity } from './airline.entity';

describe('AirlineService', () => {
  let service: AirlineService;
  let repository: Repository<AirlineEntity>;
  let airlineList: AirlineEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineService],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<AirlineEntity>>(getRepositoryToken(AirlineEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airlineList = [];
    for (let i = 0; i < 5; i++) {
      const airport: AirlineEntity = await repository.save({
        name: faker.airline.airline().name,
        description: faker.lorem.sentence(),
        founding_date: faker.date.past(),
        web_site: faker.internet.url(),
      });
      airlineList.push(airport);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airlines', async () => {
    const airlines: AirlineEntity[] = await service.findAll();
    expect(airlines).not.toBeNull();
    expect(airlines).toHaveLength(airlineList.length);
  });

  it('findOne should return a airport by id', async () => {
    const storedAirline: AirlineEntity = airlineList[0];
    const airline: AirlineEntity = await service.findOne(storedAirline.id);
    expect(airline).not.toBeNull();
    expect(airline.name).toEqual(storedAirline.name)
    expect(airline.description).toEqual(storedAirline.description)
    expect(airline.founding_date).toEqual(storedAirline.founding_date)
    expect(airline.web_site).toEqual(storedAirline.web_site)

  });

  it('findOne should throw an exception for an invalid airline', async () => {
    await expect(() => service.findOne("7f29b477-ba35-44a6-aa12-d163721af71c")).rejects.toHaveProperty("message", "The airline with the given id was not found")
  });

  it('create should return a new airline', async () => {
    const airline: AirlineEntity = {
      id: "",
      name: faker.airline.airline().name,
      description: faker.lorem.sentence(),
      founding_date: faker.date.past(),
      web_site: faker.internet.url(),
      airports: [],
    }

    const newAirline: AirlineEntity = await service.create(airline);
    expect(newAirline).not.toBeNull();

    const storedAirline: AirlineEntity = await repository.findOne({ where: { id: newAirline.id } })
    expect(storedAirline).not.toBeNull();
    expect(airline).not.toBeNull();
    expect(airline.name).toEqual(storedAirline.name)
    expect(airline.description).toEqual(storedAirline.description)
    expect(airline.founding_date).toEqual(storedAirline.founding_date)
    expect(airline.web_site).toEqual(storedAirline.web_site)
  });

  it('update should modify a airline', async () => {
    const airline: AirlineEntity = airlineList[0];
    airline.name = faker.airline.airline().name;
    airline.description = faker.lorem.sentence()
    airline.founding_date = faker.date.past();
    airline.web_site = faker.internet.url();

    const updatedAirline: AirlineEntity = await service.update(airline.id, airline);
    expect(updatedAirline).not.toBeNull();

    const storedAirline: AirlineEntity = await repository.findOne({ where: { id: airline.id } })
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.name).toEqual(airline.name)
    expect(storedAirline.description).toEqual(airline.description)
    expect(storedAirline.founding_date).toEqual(airline.founding_date)
    expect(storedAirline.web_site).toEqual(airline.web_site)

  });

  it('update should throw an exception for an invalid airline', async () => {
    let airline: AirlineEntity = airlineList[0];
    airline = {
      ...airline, name: faker.airline.airline().name,
      description: faker.lorem.sentence(),
      founding_date: faker.date.future(),
      web_site: faker.internet.url(),
    }
    await expect(() => service.update("7f29b477-ba35-44a6-aa12-d163721af71c", airline)).rejects.toHaveProperty("message", "The airline with the given id was not found")
  });

  it('delete should remove a airline', async () => {
    const airline: AirlineEntity = airlineList[0];
    await service.delete(airline.id);

    const deletedAirline: AirlineEntity = await repository.findOne({ where: { id: airline.id } })
    expect(deletedAirline).toBeNull();
  });

  it('delete should throw an exception for an invalid airport', async () => {
    const airline: AirlineEntity = airlineList[0];
    await service.delete(airline.id);
    await expect(() => service.delete("7f29b477-ba35-44a6-aa12-d163721af71c")).rejects.toHaveProperty("message", "The airline with the given id was not found")
  });

});
