import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppDummy } from './app.dummy';
import { AppJapanService } from './app.japan.service';
import { AppService } from './app.service';
import { Event } from './events/event.entity';
import { EventsModule } from './events/events.module';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'mysql',
      //host: '172.17.0.1',
      host: 'localhost',
      port: 3304,
      username: 'admin',
      password: 'admin',
      database: 'nest_events',
      entities: [Event],
      synchronize: true
    }),
    EventsModule
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
