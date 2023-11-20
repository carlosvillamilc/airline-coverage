import { Controller, Get, Post, Put, Delete, Body, HttpCode, Param, UseInterceptors } from '@nestjs/common';
import { AirportAirlineService } from './airport-airline.service';
import { AirportDto } from '../airport/airport.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptors';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AirportAirlineController {
    constructor(private readonly airportAirlineService: AirportAirlineService) { }

    @Post(':airlineId/airport/:airportId')
    async addAirportToAirline(@Param('airportId') airportId: string, @Param('airlineId') airlineId: string) {
      
        return await this.airportAirlineService.addAirportToAirline(airportId, airlineId);
    }

    @Get(':airlineId/airports')
    async findAirportsFromAirline(@Param('airlineId') airlineId: string) {
        return await this.airportAirlineService.findAirportsFromAirline(airlineId);
    }

    @Get(':airlineId/airports/:airportId')
    async findAirportFromAirline(@Param('airlineId') airlineId: string, @Param('airportId') airportId: string) {
        return await this.airportAirlineService.findAirportFromAirline(airportId, airlineId);
    }

    @Put(':airlineId/airports')
    async updateAirportsFromAirline(@Body() airportDto: AirportDto[], @Param('airlineId') airlineId: string) {
        const airportIds = airportDto.map(airport => airport.id);
        return await this.airportAirlineService.updateAirportsFromAirline(airlineId, airportIds);
    }

    @Delete(':airlineId/airports/:airportId')
    @HttpCode(204)
    async deleteAirportFromAirline(@Param('airlineId') airlineId: string, @Param('airportId') airportId: string) {
        return await this.airportAirlineService.deleteAirportFromAirline(airportId, airlineId);
    }
}
