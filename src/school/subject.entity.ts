import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Teacher } from './teacher.entity';

@Entity()
export class Subject {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;
    
    @ManyToMany(() => Teacher, (teacher) => teacher.subjects, { cascade: true })
    @JoinTable({
        name: 'subject_teacher',
        joinColumn: {
            name: 'subject_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'teacher_id'
        }
    })
    teachers: Teacher[];
}