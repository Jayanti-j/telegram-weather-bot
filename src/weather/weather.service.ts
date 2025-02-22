import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather } from './weather.interface';

// Define the correct response structure for OpenWeatherMap
interface WeatherResponse {
  name: string; // City name
  main: {
    temp: number; // Temperature in Celsius
  };
  weather: {
    description: string; // Weather condition (e.g., "clear sky", "rain")
  }[];
}

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel('Weather') private readonly weatherModel: Model<Weather>,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  // Method to save weather data
  async saveWeatherData(city: string, temperature: number, condition: string): Promise<Weather> {
    const newWeatherData = new this.weatherModel({
      city,
      temperature,
      condition,
    });
    return newWeatherData.save();
  }

  // Method to retrieve weather data by city
  async getWeatherByCity(city: string): Promise<Weather[]> {
    return this.weatherModel.find({ city }).exec();
  }

  async getWeather(city: string): Promise<string> {
    const apiKey = this.configService.get<string>('OPENWEATHERMAP_API_KEY');
    if (!apiKey) {
      throw new Error('OPENWEATHERMAP_API_KEY is not defined');
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      // Fetch weather data from OpenWeatherMap
      const response = await firstValueFrom(
        this.httpService.get<WeatherResponse>(url),
      );

      // Check if the response contains valid data
      if (!response.data.name || !response.data.main || !response.data.weather?.[0]) {
        throw new Error('Invalid weather data received from the API');
      }

      // Extract relevant data from the response
      const location = response.data.name;
      const temperature = response.data.main.temp;
      const condition = response.data.weather[0].description;

      // Save weather data to the database
      await this.saveWeatherData(location, temperature, condition);

      // Format the weather message
      return `Weather in ${location}: ${condition}, Temperature: ${temperature}°C`;
    } catch (error) {
      // Log the error for debugging
      if (error instanceof Error) {
        console.error('Error fetching weather data:', error.message);
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        // Handle Axios errors (e.g., network issues, invalid API key)
        const axiosError = error as { response?: { data?: any } };
        console.error(
          'Error response from OpenWeatherMap:',
          axiosError.response?.data,
        );
      } else {
        console.error('Unknown error:', error);
      }

      throw new Error('Failed to fetch weather data. Please try again later.');
    }
  }
}