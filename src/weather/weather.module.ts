import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherSchema } from './weather.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    HttpModule, // Import HttpModule for Axios requests
    MongooseModule.forFeature([{ name: 'Weather', schema: WeatherSchema }]), // Register MongoDB schema for Weather
  ],
  providers: [WeatherService], // WeatherService to interact with MongoDB
  exports: [WeatherService], // Export WeatherService to be used in other modules
  controllers: [WeatherController], // Add controller if you want to expose routes
})
export class WeatherModule {}
