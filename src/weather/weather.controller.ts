import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { Weather } from './weather.interface';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  // Endpoint to save weather data
  @Post('save')
  async saveWeather(
    @Body() weatherData: { city: string; temperature: number; condition: string },
  ): Promise<Weather> {
    return this.weatherService.saveWeatherData(
      weatherData.city,
      weatherData.temperature,
      weatherData.condition,
    );
  }

  // Endpoint to get weather data by city
  @Get('city/:city')
  async getWeatherByCity(@Param('city') city: string): Promise<Weather[]> {
    return this.weatherService.getWeatherByCity(city);
  }
}
