import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirportEntity } from '../airport/airport.entity';
import { AirlineEntity } from '../airline/airline.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class AirportAirlineService {
    constructor(
        @InjectRepository(AirportEntity)
        private readonly airportRepository: Repository<AirportEntity>,
        @InjectRepository(AirlineEntity)
        private readonly airlineRepository: Repository<AirlineEntity>
    ) { }

    async addAirportToAirline(airportId: string, airlineId: string): Promise<AirlineEntity> {
        const airport = await this.airportRepository.findOne({ where: { id: airportId } });
        if (!airport)
            throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND);

        const airline = await this.airlineRepository.findOne({ where: { id: airlineId }, relations: ["airports"] });
        if (!airline)
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);

        airline.airports = [...airline.airports, airport];
        return await this.airlineRepository.save(airline);
    }

    async findAirportsFromAirline(airlineId: string): Promise<AirportEntity[]> {

        const airline = await this.airlineRepository.findOne({ where: { id: airlineId }, relations: ["airports"] });
        if (!airline)
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
        
        const airports = airline.airports
        if (!airports || airports.length === 0)
        throw new BusinessLogicException("No airports found for the given airline", BusinessError.PRECONDITION_FAILED);

        return airports;
    }

    async findAirportFromAirline(airportId: string, airlineId: string): Promise<AirportEntity> {

        const airline = await this.airlineRepository.findOne({ where: { id: airlineId }, relations: ["airports"] });
        if (!airline)
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
        
        const airport = airline.airports.find(airport => airport.id === airportId);
        if (!airport)
            throw new BusinessLogicException("The airport with the given id was not found", BusinessError.PRECONDITION_FAILED);

        return airport;
    }

    async updateAirportsFromAirline(airlineId: string, airportIds: string[]): Promise<AirlineEntity> {
        const airline = await this.airlineRepository.findOne({ where: { id: airlineId }, relations: ["airports"] });
        if (!airline) {
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
        }

        const airports: AirportEntity[] = [];

        for (const airportId of airportIds) {
            const airport = await this.airportRepository.findOne({ where: { id: airportId } });
            if (!airport) {
                throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND);
            }
            airports.push(airport);
        }

        airline.airports = airports;

        return await this.airlineRepository.save(airline);
    }

    async deleteAirportFromAirline(airportId: string, airlineId: string): Promise<AirportEntity> {
        const airline = await this.airlineRepository.findOne({ where: { id: airlineId }, relations: ["airports"] });
        if (!airline)
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
        
        const airport = airline.airports.find(airport => airport.id === airportId);
        if (!airport)
            throw new BusinessLogicException("The airport with the given id was not found", BusinessError.PRECONDITION_FAILED);

        return await this.airportRepository.remove(airport);
    }
}
