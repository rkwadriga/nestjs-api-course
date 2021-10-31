import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Like, MoreThan, Repository} from 'typeorm';
import {CreateEventDto} from './create-event.dto';
import {Event} from './event.entity';
import {UpdateEventDto} from './update.event.dto';
import {Attendee} from "./attendee.entity";
import {EventsService} from "./events.service";

@Controller('/events')
export class EventsController {
    private readonly logger = new Logger(EventsController.name);
    
    constructor(
        @InjectRepository(Event)
        private readonly repository: Repository<Event>,

        @InjectRepository(Attendee)
        private readonly attendeeRepository: Repository<Attendee>,
        
        private readonly eventsService: EventsService
    ) {}
    
    @Get()
    async findAll() {
        this.logger.log('Hit the findAll route');
        const events = await this.repository.find();
        this.logger.debug(`Found ${events.length} events`);
        
        return events;
    }
    
    @Get('/practice')
    async practice() {
        return await this.repository.find({
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
        });
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
        
        return  this.repository.createQueryBuilder('e')
            .select([
                'e.id',
                'e.name'
            ])
            .orderBy('e.id', 'DESC')
            .take(3) // Limit
            .getMany();
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
    //async create(@Body(ValidationPipe) input: CreateEventDto) { // Use this option if the ValidationPipe doesn't enabled in main.ts
    //async create(@Body(new ValidationPipe({groups: ['create']})) input: CreateEventDto) {
    async create(@Body() input: CreateEventDto) {
        return await this.repository.save({
            ...input,
            when: new Date(input.when),
        });
    }
    
    @Patch(':id')
    async update(@Param('id') id, @Body() input: UpdateEventDto) {
        const event = await this.repository.findOne(id);
        
        return await this.repository.save({
            ...event,
            ...input,
            when: input.when ? new Date(input.when) : event.when,
        });
    }
    
    @Delete(':id')
    @HttpCode(204) // No content
    async remove(@Param('id') id) {
        const event = await this.repository.findOne(id);
        
        await this.repository.remove(event);
    }
}
