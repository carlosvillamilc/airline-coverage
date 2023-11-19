import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class AirportDto {

    readonly id: string;

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly code: string;

    @IsString()
    @IsNotEmpty()
    readonly country: string;

    @IsString()
    @IsNotEmpty()
    readonly city: string;
}