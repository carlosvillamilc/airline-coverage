import { Column, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import { AirlineEntity } from 'src/airline/airline.entity';
@Entity()
export class AirportEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    code: string;

    @Column()
    country: string;

    @Column()
    city: string;

    @ManyToMany(() => AirlineEntity, airline => airline.airports)
    @JoinTable()
    airlines: AirlineEntity[];
}