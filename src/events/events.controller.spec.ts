import {EventsService} from "./events.service";
import {EventsController} from "./events.controller";
import {Repository} from "typeorm";
import {Event} from "./event.entity";
import {ListEvents} from "./input/list.events";
import {User} from "../auth/user.entity";
import {NotFoundException} from "@nestjs/common";


describe('EventsController', () => {
    let eventsController: EventsController;
    let eventsService: EventsService;
    let eventsRepository: Repository<Event>;
    
    //beforeAll(() => console.log('This logged once'));
    
    beforeEach(() => {
        eventsService = new EventsService(eventsRepository);
        eventsController = new EventsController(eventsService);
    });
    
    // "it" = "test"
    it('Should return a list of events', async () => {
        const result = {
            first: 1,
            last: 1,
            limit: 10,
            data: []
        };
    
        // Mock hte "getEventsWithAttendeeCountFilteredPaginated" method of EventsService
        
        // Just mock the method
        //eventsService.getEventsWithAttendeeCountFilteredPaginated = jest.fn().mockImplementation((): any => result);
        
        // Create a spy for method - it makes possible to calculate this method calls
        const spy = jest.spyOn(eventsService, 'getEventsWithAttendeeCountFilteredPaginated').mockImplementation((): any => result);
        
        expect(await eventsController.findAll(new ListEvents())).toEqual(result);
        expect(spy).toBeCalledTimes(1);
    });
    
    
    it('Should not delete an event when it is not found', async () => {
        const deleteSpy = jest.spyOn(eventsService, 'removeEvent');
        const findOneSpy = jest.spyOn(eventsService, 'findOne').mockImplementation((): any => undefined);
        
        try {
            await eventsController.remove(1, new User());
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
        }
        
        expect(deleteSpy).toBeCalledTimes(0);
        expect(findOneSpy).toBeCalledTimes(1);
    });
    
    it('Should delete an event whn it is found', async () => {
        const user = new User();
        user.id = 1;
    
        const event = new Event({
            organizer_id: user.id
        });
    
        const deleteSpy = jest.spyOn(eventsService, 'removeEvent').mockImplementation((): any => undefined);
        const findOneSpy = jest.spyOn(eventsService, 'findOne').mockImplementation((): any => event);
    
        await eventsController.remove(1, user);
    
        expect(deleteSpy).toBeCalledTimes(1);
        expect(findOneSpy).toBeCalledTimes(1);
    });
});