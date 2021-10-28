import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Event } from './event.entity';
import { EventsController } from './events.controller';

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
  })],
  controllers: [AppController, EventsController],
  providers: [AppService],
})
export class AppModule {}
