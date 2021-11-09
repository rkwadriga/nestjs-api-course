import {Repository} from "typeorm";
import {Attendee} from "./attendee.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";
import {CreateAttendeeDto} from "./input/create-attendee.dto";

@Injectable()
export  class AttendeeService {
    constructor(
        @InjectRepository(Attendee)
        private readonly attendeeRepository: Repository<Attendee>
    ) {}
    
    public async findByEventId(eventID: number): Promise<Attendee[]> {
        return await this.attendeeRepository.find({
            event: {id: eventID}
        });
    }
    
    public async findOneByEventIdAndUserId(eventId: number, userId: number): Promise<Attendee|undefined> {
        return await this.attendeeRepository.findOne({
            event: {id: eventId},
            user: {id: userId}
        });
    }
    
    public async createOrUpdate(input: CreateAttendeeDto, eventId: number, userId: number): Promise<Attendee> {
        const attendee = await this.findOneByEventIdAndUserId(eventId, userId) ?? new Attendee();
    
        attendee.event_id = eventId;
        attendee.user_id = userId;
        attendee.answer = input.answer;
        
        return await this.attendeeRepository.save(attendee);
    }
}