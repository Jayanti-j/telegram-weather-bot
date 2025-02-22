import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotModule } from './bot/bot.module';
import { WeatherModule } from './weather/weather.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://jayantigupta489:mYRWiCEZUZeNtTAq@cluster0.mkwv2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    ),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BotModule,
    WeatherModule,
    AuthModule,
    AdminModule,
    SubscriptionModule, // Add SubscriptionModule here
  ],
})
export class AppModule {}
