import {
    Body, ClassSerializerInterceptor,
    Controller,
    Get, NotFoundException,
    Param,
    ParseIntPipe,
    Put, Query,
    SerializeOptions,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {EventsService} from "./events.service";
import {AttendeeService} from "./attendee.service";
import {CreateAttendeeDto} from "./input/create-attendee.dto";
import {CurrentUser} from "../auth/current-user.decorator";
import {User} from "../auth/user.entity";
import {AuthGuardJwt} from "../auth/auth-guard.jwt";


@Controller('/events-attendance')
@SerializeOptions({strategy: 'excludeAll'})
export class CurrentUserEventAttendanceController {
    constructor(
        private readonly eventsService: EventsService,
        private readonly attendeeService: AttendeeService
    ) {}
    
    @Get()
    @UseGuards(AuthGuardJwt)
    async findAll(@CurrentUser() user: User, @Query('page') page = 1) {
        return this.eventsService.getEventsAttendedByUserIdPaginated(user.id, {
            limit: 5,
            currentPage: page
        })
    }
    
    @Get('/:eventId')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(@Param('eventId', ParseIntPipe) eventId: number, @CurrentUser() user: User) {
        const attendee = await this.attendeeService.findOneByEventIdAndUserId(eventId, user.id);
        if (!attendee) {
            throw new NotFoundException();
        }
        
        return attendee;
    }
    
    @Put('/:eventId')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async createOrUpdate(
        @Param('eventId', ParseIntPipe) eventId: number,
        @Body() input: CreateAttendeeDto,
        @CurrentUser() user: User
    ) {
        return this.attendeeService.createOrUpdate(input, eventId, user.id);
    }
}