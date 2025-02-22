import { Document } from 'mongoose';

export interface Weather extends Document {
  city: string;
  temperature: number;
  condition: string;
  date: Date;
}
