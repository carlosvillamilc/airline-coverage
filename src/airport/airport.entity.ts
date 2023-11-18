import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}