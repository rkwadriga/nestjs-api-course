import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Attendee} from "./attendee.entity";
import {User} from "../auth/user.entity";

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;
    
    @Column()
    description: string;
    
    @Column()
    when: Date;
    
    @Column()
    address: string;
    
    @OneToMany(() => Attendee, (attendee) => attendee.event, {
        //eager: true, // Load the related records always
        //cascade: ['insert', 'update'], // For specific operations
        cascade: true // For all operations
    })
    attendees: Attendee[];
    
    @ManyToOne(() => User, (user) => user.organized)
    @JoinColumn({
        name: 'organizer_id'
    })
    organizer: User;
    
    attendeeCount?: number;
    attendeeAccepted?: number;
    attendeeMaybe?: number;
    attendeeRejected?: number;
}
