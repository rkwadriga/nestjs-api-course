import {EventsService} from "./events.service";
import {Repository} from "typeorm";
import {Test} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Event} from "./event.entity";
import * as paginator from './../pagination/paginator';


jest.mock('./../pagination/paginator');

describe('EventsService', () => {
    let service: EventsService;
    let repository: Repository<Event>;
    let selectQb;
    let deleteQb;
    let mockedPaginate;
    
    beforeEach(async () => {
        mockedPaginate = paginator.paginate as jest.Mock;
        
        deleteQb = {
            where: jest.fn(),
            execute: jest.fn()
        };
    
        selectQb = {
            delete: jest.fn().mockReturnValue(deleteQb),
            where: jest.fn(),
            andWhere: jest.fn(),
            execute: jest.fn(),
            orderBy: jest.fn(),
            leftJoinAndSelect: jest.fn()
        };
        
        const module = await Test.createTestingModule({
            providers: [
                EventsService,
                {
                    provide: getRepositoryToken(Event),
                    useValue: {
                        save: jest.fn(),
                        createQueryBuilder: jest.fn().mockReturnValue(selectQb),
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
    
    describe('updateEvent', () => {
        it('Should update the event', async () => {
            const repoSpy = jest.spyOn(repository, 'save').mockResolvedValue({id: 1} as Event);
            
            await expect(service.updateEvent(new Event({id: 1}), {
                name: 'New name'
            })).resolves.toEqual({id: 1});
            
            expect(repoSpy).toBeCalledWith({id: 1, name: 'New name'});
        });
    });
    
    describe('deleteEvent', () => {
        it('Should delete an event', async () => {
            const createQueryBuilderSpy = jest.spyOn(repository, 'createQueryBuilder');
            const deleteSpy = jest.spyOn(selectQb, 'delete');
            const whereSpy = jest.spyOn(deleteQb, 'where').mockReturnValue(deleteQb);
            const executeSpy = jest.spyOn(deleteQb, 'execute');
            
            await expect(service.removeEvent(new Event({id: 1}))).resolves.toBe(undefined);
            
            expect(createQueryBuilderSpy).toHaveBeenCalledTimes(1);
            expect(createQueryBuilderSpy).toHaveBeenCalledWith('e');
            
            expect(deleteSpy).toHaveBeenCalledTimes(1);
    
            expect(whereSpy).toHaveBeenCalledTimes(1);
            expect(whereSpy).toHaveBeenCalledWith({id: 1});
    
            expect(executeSpy).toHaveBeenCalledTimes(1);
        });
    });
    
    describe('getEventsAttendedByUserIdPaginated', () => {
        it('Should return a list of paginated events', async () => {
            const orderBySpy = jest.spyOn(selectQb, 'orderBy').mockReturnValue(selectQb);
            const leftJoinSpy = jest.spyOn(selectQb, 'leftJoinAndSelect').mockReturnValue(selectQb);
            const andWhereSpy = jest.spyOn(selectQb, 'andWhere').mockReturnValue(selectQb);
    
            mockedPaginate.mockResolvedValue({
                first: 1,
                last: 1,
                total: 10,
                limit: 10,
                data: []
            });
            
            await expect(service.getEventsAttendedByUserIdPaginated(500, {limit: 1, currentPage: 1})).resolves.toEqual({
                first: 1,
                last: 1,
                total: 10,
                limit: 10,
                data: []
            });
            
            expect(orderBySpy).toBeCalledTimes(1);
            expect(orderBySpy).toBeCalledWith('e.id', 'DESC');
    
            expect(leftJoinSpy).toBeCalledTimes(1);
            expect(leftJoinSpy).toBeCalledWith('e.attendees', 'a');
    
            expect(andWhereSpy).toBeCalledTimes(1);
            expect(andWhereSpy).toBeCalledWith('a.user_id = :userId', {userId: 500});
            
            expect(mockedPaginate).toBeCalledTimes(1);
            expect(mockedPaginate).toBeCalledWith(selectQb, {limit: 1, currentPage: 1});
        });
    });
});