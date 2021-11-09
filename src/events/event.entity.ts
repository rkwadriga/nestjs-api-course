import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Attendee} from "./attendee.entity";
import {User} from "../auth/user.entity";
import {Expose} from "class-transformer";
import {PaginationResult} from "../pagination/paginator";

export type PaginatedEvents = PaginationResult<Event>;

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    @Expose()
    id: number;
    
    @Column()
    @Expose()
    name: string;
    
    @Column()
    @Expose()
    description: string;
    
    @Column()
    @Expose()
    when: Date;
    
    @Column()
    @Expose()
    address: string;
    
    @OneToMany(() => Attendee, (attendee) => attendee.event, {
        //eager: true, // Load the related records always
        //cascade: ['insert', 'update'], // For specific operations
        cascade: true // For all operations
    })
    @Expose()
    attendees: Attendee[];
    
    @ManyToOne(() => User, (user) => user.organized)
    @JoinColumn({
        name: 'organizer_id'
    })
    @Expose()
    organizer: User;
    
    @Column()
    organizer_id: number;
    
    @Expose()
    attendeeCount?: number;
    
    @Expose()
    attendeeAccepted?: number;
    
    @Expose()
    attendeeMaybe?: number;
    
    @Expose()
    attendeeRejected?: number;
    
    constructor(partial?: Partial<Event>) {
        Object.assign(this, partial);
    }
}
