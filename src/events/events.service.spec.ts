import {EventsService} from "./events.service";
import {Repository} from "typeorm";
import {Test} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Event} from "./event.entity";


describe('EventsService', () => {
    let service: EventsService;
    let repository: Repository<Event>;
    
    beforeEach(() => {
        const module = await Test.createTestingModule({
            providers: [
                EventsService,
                {
                    provide: getRepositoryToken(Event),
                    useValue: {
                        save: jest.fn(),
                        createQueryBuilder: jest.fn(),
                        delete: jest.fn(),
                        where: jest.fn(),
                        execute: jest.fn()
                    }
                }
            ]
        }).compile();
    
        service = module.get<EventsService>(EventsService);
        repository = module.get<Repository<Event>>(getRepositoryToken(Event));
    });
});