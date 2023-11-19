import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class AirlineDto {

    readonly id: string;

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsString()
    @IsNotEmpty()
    readonly founding_date: string;

    @IsUrl()
    @IsNotEmpty()
    readonly web_site: string;
}