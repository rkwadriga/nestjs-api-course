import {ClassSerializerInterceptor, Controller, Get, Param, SerializeOptions, UseInterceptors} from "@nestjs/common";
import {AttendeeService} from "./attendee.service";
import {Attendee} from "./attendee.entity";


@Controller('/events/:eventId/attendees')
@SerializeOptions({strategy: 'excludeAll'})
export class EventsAttendeesController {
    constructor(
        private readonly attendeeService: AttendeeService
    ) {}
    
    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(@Param('eventId') eventId: number): Promise<Attendee[]> {
        return await this.attendeeService.findByEventId(eventId);
    }
}