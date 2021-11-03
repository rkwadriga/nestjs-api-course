import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Profile} from "./profile.entity";
import {Event} from "../events/event.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({unique: true})
    username: string;
    
    @Column()
    password: string;
    
    @Column({unique: true})
    email: string;
    
    @Column()
    firstName: string;
    
    @Column()
    lastName: string;
    
    @OneToOne(() => Profile)
    @JoinColumn({name: 'profile_id'})
    profile?: Profile;
    
    @OneToMany(() => Event, (event) => event.organizer)
    organized: Event[];
}