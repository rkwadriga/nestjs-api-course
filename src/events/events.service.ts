import {InjectRepository} from "@nestjs/typeorm";
import {Event} from "./event.entity";
import {Repository, SelectQueryBuilder} from "typeorm";
import {Injectable, Logger} from "@nestjs/common";

@Injectable()
export  class EventsService {
    private readonly logger = new Logger(EventsService.name);
    
    constructor(
        @InjectRepository(Event)
        private readonly eventsRepository: Repository<Event>,
    ) {}
    
    public async getEvent(id: number): Promise<Event|undefined> {
        const query = this.getEventsBaseQuery().andWhere({id});
        this.logger.debug(query.getSql());
        
        return await query.getOne();
    }
    
    private getEventsBaseQuery(): SelectQueryBuilder<Event> {
        return this.eventsRepository.createQueryBuilder('e')
            .orderBy('e.id', 'DESC');
    }
}