import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Profile} from "./profile.entity";


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
}