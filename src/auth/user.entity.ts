import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Profile} from "./profile.entity";
import {Event} from "../events/event.entity";
import {Expose} from "class-transformer";
import {Attendee} from "../events/attendee.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @Expose()
    id: number;
    
    @Column({unique: true})
    @Expose()
    username: string;
    
    @Column()
    password: string;
    
    @Column({unique: true})
    @Expose()
    email: string;
    
    @Column()
    @Expose()
    firstName: string;
    
    @Column()
    @Expose()
    lastName: string;
    
    @OneToOne(() => Profile)
    @JoinColumn({name: 'profile_id'})
    @Expose()
    profile?: Profile;
    
    @OneToMany(() => Event, (event) => event.organizer)
    @Expose()
    organized: Event[];
    
    @OneToMany(() => Attendee, (attendee) => attendee.user)
    attended: Attendee[];
}