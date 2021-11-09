import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import {Attendee} from "./attendee.entity";
import {EventsService} from "./events.service";
import {AttendeeService} from "./attendee.service";
import {EventsOrganizedByUserController} from "./events-organized-by-user.controller";
import {CurrentUserEventAttendanceController} from "./current-user-event-attendance.controller";
import {EventAttendeesController} from "./event-attendees.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([Event, Attendee])
    ],
    controllers: [EventsController, EventAttendeesController, EventsOrganizedByUserController, CurrentUserEventAttendanceController],
    providers: [EventsService, AttendeeService]
})
export class EventsModule {}
