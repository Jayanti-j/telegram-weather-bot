import { Schema } from 'mongoose';

export const WeatherSchema = new Schema({
  city: { type: String, required: true },
  temperature: { type: Number, required: true },
  condition: { type: String, required: true },
  // Add other fields as needed
});
