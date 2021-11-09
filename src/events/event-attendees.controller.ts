import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    SerializeOptions,
    UseInterceptors
} from "@nestjs/common";
import {AttendeeService} from "./attendee.service";
import {Attendee} from "./attendee.entity";


@Controller('/events/:eventId/attendees')
@SerializeOptions({strategy: 'excludeAll'})
export class EventAttendeesController {
    constructor(
        private readonly attendeeService: AttendeeService
    ) {}
    
    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(@Param('eventId', ParseIntPipe) eventId: number): Promise<Attendee[]> {
        return await this.attendeeService.findByEventId(eventId);
    }
}