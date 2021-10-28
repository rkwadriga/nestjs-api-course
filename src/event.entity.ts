import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    descriptiomn: string;

    @Column()
    when: Date;

    @Column()
    address: string;
}