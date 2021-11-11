import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppDummy } from './app.dummy';
import { AppJapanService } from './app.japan.service';
import { AppService } from './app.service';
import ormConfig from './config/orm.config';
import { EventsModule } from './events/events.module';
import {SchoolModule} from "./school/school.module";
import {AuthModule} from "./auth/auth.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [ormConfig],
            expandVariables: true, // Allows to do something like "SUPPORT_EMAIL=support@${APP_URL}" in .env.dev file
            envFilePath: `.env.${process.env.NODE_ENV}` // This variable is set in package.json file (scripts.start:dev section for example)
        }),
        TypeOrmModule.forRootAsync({useFactory: ormConfig}),
        /*TypeOrmModule.forRoot({
            type: 'mysql',
            //host: '172.17.0.1',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [Event],
            synchronize: true
        }),*/
        AuthModule,
        EventsModule,
        SchoolModule
    ],
    controllers: [AppController],
    providers: [
        {
            provide: AppService,
            useClass: AppJapanService
        },
        {
            provide: 'APP_NAME',
            useValue: 'Nest Events Backend'
        },
        {
            provide: 'MESSAGE',
            inject: [AppDummy],
            useFactory: (app) => `${app.dummy()}`
        },
        AppDummy
    ],
    })
    export class AppModule {}
