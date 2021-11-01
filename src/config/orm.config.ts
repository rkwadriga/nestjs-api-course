import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Event } from "src/events/event.entity";
import { Attendee } from "../events/attendee.entity";
import {Subject} from "../school/subject.entity";
import {Teacher} from "../school/teacher.entity";
import {User} from "../auth/user.entity";
import {Profile} from "../auth/profile.entity";

export default (): TypeOrmModuleOptions => ({
    type: 'mysql',
    //host: '172.17.0.1',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        Event,
        Attendee,
        Subject,
        Teacher,
        User,
        Profile
    ],
    synchronize: true
});