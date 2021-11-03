import {
    Body,
    Controller,
    Delete, ForbiddenException,
    Get,
    HttpCode,
    Logger,
    NotFoundException,
    Param,
    Patch,
    Post, Query, UseGuards, UsePipes, ValidationPipe,
} from '@nestjs/common';
import {CreateEventDto} from './input/create-event.dto';
import {UpdateEventDto} from './input/update.event.dto';
import {EventsService} from "./events.service";
import {ListEvents} from "./input/list.events";
import {User} from "../auth/user.entity";
import {CurrentUser} from "../auth/current-user.decorator";
import {AuthGuardJwt} from "../auth/auth-guard.jwt";

@Controller('/events')
export class EventsController {
    private readonly logger = new Logger(EventsController.name);
    
    constructor(
        private readonly eventsService: EventsService
    ) {}
    
    @Get()
    @UsePipes(new ValidationPipe({transform: true}))
    async findAll(@Query() filter: ListEvents) {
        if (filter && typeof filter.when === 'string') {
            filter.when = parseInt(filter.when);
        }
        this.logger.log('Hit the findAll route');
        const paginator = await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
            filter,
            {
                total: true,
                currentPage: filter.page,
                limit: 3
            }
        );
        this.logger.debug(`Found ${paginator.data.length} events`);
        
        return paginator;
    }
    
    @Get(':id')
    async findOne(@Param('id') id) {
        const event = await this.eventsService.getEvent(id);
        if (!event) {
            throw new NotFoundException(`Event #${id} not found`);
        }
        
        return event;
    }
    
    @Post()
    @UseGuards(AuthGuardJwt)
    //async create(@Body(ValidationPipe) input: CreateEventDto) { // Use this option if the ValidationPipe doesn't enabled in main.ts
    //async create(@Body(new ValidationPipe({groups: ['create']})) input: CreateEventDto) {
    async create(@Body() input: CreateEventDto, @CurrentUser() user: User) {
        return await this.eventsService.createEvent(input, user);
    }
    
    @Patch(':id')
    @UseGuards(AuthGuardJwt)
    async update(@Param('id') id, @Body() input: UpdateEventDto, @CurrentUser() user: User) {
        const event = await this.eventsService.getEvent(id)
        if (!event) {
            throw new NotFoundException();
        }
        
        if (event.organizer_id !== user.id) {
            throw new ForbiddenException(null, 'You are not organizer of this even to update itt');
        }
        
        return await this.eventsService.updateEvent(event, input);
    }
    
    @Delete(':id')
    @UseGuards(AuthGuardJwt)
    @HttpCode(204) // No content
    async remove(@Param('id') id, @CurrentUser() user: User) {
        const event = await this.eventsService.getEvent(id)
        if (!event) {
            throw new NotFoundException();
        }
    
        if (event.organizer_id !== user.id) {
            throw new ForbiddenException(null, 'You are not organizer of this event to delete it');
        }
        
        await this.eventsService.removeEvent(event);
    }
    
    
    
    @Get('/practice')
    async practice() {
        /*return await this.eventsRepository.find({
            select: ['id', 'name', 'when'],
            //where: {id: 3}
            where: [
                // That means "OR" between the filtering criterias
                {
                    id: MoreThan(3),
                    when: MoreThan(new Date('2021-10-26')),
                },
                {
                    description: Like('%meet%'),
                },
            ],
            take: 3, // Limit
            skip: 1, // Offset
            order: {
                id: 'DESC',
            },
        });*/
    }
    
    @Get('/practice2')
    async practice2() {
        /*const event = await this.repository.findOne(1, {
            //loadEagerRelations: false // Do not load the related records
            relations: ['attendees'] // Load specific relations
        });*/
        //return await this.repository.findOne(1);
        
        //const event = await this.repository.findOne(1);
        /*const event = new Event();
        event.id = 1;*/
        
        /*const attendee = new Attendee();
        attendee.name = 'Using cascade';
        /!*attendee.event = event;
        await this.attendeeRepository.save(attendee);*!/
        event.attendees.push(attendee);
        await this.repository.save(event);
        
        return event;*/
        
        //return await this.attendeeRepository.find({event: event});
        
        /*return  this.eventsRepository.createQueryBuilder('e')
            .select([
                'e.id',
                'e.name'
            ])
            .orderBy('e.id', 'DESC')
            .take(3) // Limit
            .getMany();*/
    }
}
