import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppDummy } from './app.dummy';
import { AppJapanService } from './app.japan.service';
import { AppService } from './app.service';
import ormConfig from './config/orm.config';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true // Allows to do something like "SUPPORT_EMAIL=support@${APP_URL}" in .env files
    }),
    TypeOrmModule.forRootAsync({useFactory: ormConfig}),
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
