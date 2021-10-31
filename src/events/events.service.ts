import {InjectRepository} from "@nestjs/typeorm";
import {Event} from "./event.entity";
import {Repository, SelectQueryBuilder} from "typeorm";
import {Injectable, Logger} from "@nestjs/common";
import {AttendeeAnswerEnum} from "./attendee.entity";

@Injectable()
export  class EventsService {
    private readonly logger = new Logger(EventsService.name);
    
    constructor(
        @InjectRepository(Event)
        private readonly eventsRepository: Repository<Event>,
    ) {}
    
    public async getEvent(id: number): Promise<Event|undefined> {
        const query = this.getEventWithAttendeeCountQuery().andWhere({id});
        this.logger.debug(query.getSql());
        
        return await query.getOne();
    }
    
    private getEventWithAttendeeCountQuery(): SelectQueryBuilder<Event> {
        return this.getEventsBaseQuery()
            .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
            .loadRelationCountAndMap(
                'e.attendeeAccepted',
                'e.attendees',
                'attendee',
                (qb) => qb
                    .where('attendee.answer = :answer', {answer: AttendeeAnswerEnum.Accepted})
            )
            .loadRelationCountAndMap(
                'e.attendeeMaybe',
                'e.attendees',
                'attendee',
                (qb) => qb
                    .where('attendee.answer = :answer', {answer: AttendeeAnswerEnum.Maybe})
            )
            .loadRelationCountAndMap(
                'e.attendeeRejected',
                'e.attendees',
                'attendee',
                (qb) => qb
                    .where('attendee.answer = :answer', {answer: AttendeeAnswerEnum.Rejected})
            )
    }
    
    private getEventsBaseQuery(): SelectQueryBuilder<Event> {
        return this.eventsRepository.createQueryBuilder('e')
            .orderBy('e.id', 'DESC');
    }
}