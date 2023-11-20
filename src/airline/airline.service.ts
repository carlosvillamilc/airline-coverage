import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirlineEntity } from './airline.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { checkUUID } from '../shared/utils';
@Injectable()
export class AirlineService {
    constructor(
        @InjectRepository(AirlineEntity)
        private readonly airlineRepository: Repository<AirlineEntity>
    ) { }

    async findAll(): Promise<AirlineEntity[]> {
        return await this.airlineRepository.find();
    }

    async findOne(id: string): Promise<AirlineEntity> {

        if(checkUUID(id) == false){
            throw new BusinessLogicException("The provided id hasn't UUID format", BusinessError.BAD_REQUEST);
        }

        const airline: AirlineEntity = await this.airlineRepository.findOne({ where: { id } });
        if (!airline)
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);

        return airline;
    }

    async create(airline: AirlineEntity): Promise<AirlineEntity> {
        let actualDate = new Date(Date.now());
     
        if (airline.founding_date >= actualDate) {
            throw new BusinessLogicException("Airline founding date must be in the past", BusinessError.BAD_REQUEST);
        }
        return await this.airlineRepository.save(airline);
    }

    async update(id: string, airline: AirlineEntity): Promise<AirlineEntity> {

        if(checkUUID(id) == false){
            throw new BusinessLogicException("The provided id hasn't UUID format", BusinessError.BAD_REQUEST);
        }

        const persistedAirline: AirlineEntity = await this.airlineRepository.findOne({ where: { id } });
        if (!persistedAirline)
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
        let actualDate = new Date(Date.now());
        
        if (airline.founding_date >= actualDate) {
            throw new BusinessLogicException("Airline founding date must be in the past", BusinessError.BAD_REQUEST);
        }

        return await this.airlineRepository.save({ ...persistedAirline, ...airline });
    }

    async delete(id: string) {
        
        if(checkUUID(id) == false){
            throw new BusinessLogicException("The provided id hasn't UUID format", BusinessError.BAD_REQUEST);
        }
        
        const airline: AirlineEntity = await this.airlineRepository.findOne({ where: { id } });
        if (!airline)
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);

        await this.airlineRepository.remove(airline);
    }


}
