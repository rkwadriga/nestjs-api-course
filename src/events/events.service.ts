import {InjectRepository} from "@nestjs/typeorm";
import {Event, PaginatedEvents} from "./event.entity";
import {DeleteResult, Repository, SelectQueryBuilder} from "typeorm";
import {Injectable, Logger} from "@nestjs/common";
import {AttendeeAnswerEnum} from "./attendee.entity";
import {ListEvents, WhenEventFilter} from "./input/list.events";
import {paginate, PaginateOptions} from "../pagination/paginator";
import {CreateEventDto} from "./input/create-event.dto";
import {User} from "../auth/user.entity";
import {UpdateEventDto} from "./input/update.event.dto";

@Injectable()
export  class EventsService {
    private readonly logger = new Logger(EventsService.name);
    
    constructor(
        @InjectRepository(Event)
        private readonly eventsRepository: Repository<Event>
    ) {}
    
    public async getEvent(id: number): Promise<Event|undefined> {
        const query = this.getEventWithAttendeeCountQuery().andWhere({id});
        this.logger.debug(query.getSql());
        
        return await query.getOne();
    }
    
    public async getEventsWithAttendeeCountFilteredPaginated(filter: ListEvents, paginateOptions: PaginateOptions): Promise<PaginatedEvents> {
        return await paginate(
            this.getEventsWithAttendeeCountFilteredQuery(filter),
            paginateOptions
        );
    }
    
    public async createEvent(input: CreateEventDto, user: User): Promise<Event> {
        return await this.eventsRepository.save({
            ...input,
            when: new Date(input.when),
            organizer: user
        });
    }
    
    public async updateEvent(event: Event, input: UpdateEventDto): Promise<Event> {
        return await this.eventsRepository.save({
            ...event,
            ...input,
            when: input.when ? new Date(input.when) : event.when
        });
    }
    
    public async removeEvent(event: Event): Promise<DeleteResult> {
        return await this.eventsRepository.createQueryBuilder('e')
            .delete()
            .where({id: event.id})
            .execute();
    }
    
    public async getEventsOrganizedByUserIdPaginated(userId: number, paginateOptions: PaginateOptions): Promise<PaginatedEvents> {
        return await paginate<Event>(
            this.getEventsOrganizedByUserIdQuery(userId),
            paginateOptions
        );
    }
    
    public async getEventsAttendedByUserIdPaginated(userId: number, paginateOptions: PaginateOptions): Promise<PaginatedEvents> {
        return await paginate<Event>(
            this.getEventsAttendedByUserIdQuery(userId),
            paginateOptions
        );
    }
    
    private getEventsAttendedByUserIdQuery(userId: number): SelectQueryBuilder<Event> {
        return this.getEventsBaseQuery()
            .leftJoinAndSelect('e.attendees', 'a')
            .andWhere('a.user_id = :userId', {userId});
    }
    
    private getEventsOrganizedByUserIdQuery(userId: number): SelectQueryBuilder<Event> {
        return this.getEventsBaseQuery().andWhere({organizer: {id: userId}});
    }
    
    private getEventsWithAttendeeCountFilteredQuery(filter?: ListEvents): SelectQueryBuilder<Event> {
        let query = this.getEventWithAttendeeCountQuery();
        if (filter) {
            switch (filter.when) {
                case WhenEventFilter.Today:
                    query.andWhere(
                        `e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`
                    );
                    break;
                case WhenEventFilter.Tomorrow:
                    query.andWhere(
                        `e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAYS`
                    );
                    break;
                case WhenEventFilter.ThisWeek:
                    query.andWhere(
                        `YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)`
                    );
                    break;
                case WhenEventFilter.NextWeek:
                    query.andWhere(
                        `YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1`
                    );
                    break;
            }
        }
    
        return query;
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