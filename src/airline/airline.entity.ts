import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AirportEntity } from 'src/airport/airport.entity';
@Entity()
export class AirlineEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    founding_date: Date;

    @Column()
    web_site: string;

    @ManyToMany(() => AirportEntity, airport => airport.airlines)    
    airports: AirportEntity[];

}