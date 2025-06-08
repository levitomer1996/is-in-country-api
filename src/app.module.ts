import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountriesModule } from './countries/countries.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    CountriesModule,
    MongooseModule.forRoot('mongodb://localhost:27017/isincountry'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
