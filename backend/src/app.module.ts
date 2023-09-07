import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoryModule } from './category/category.module';
import { EventModule } from './event/event.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    AuthModule,
    BlogModule,
    EventModule,
    BookingModule,
    CategoryModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../dist/src/uploads'),
      // serveStaticOptions: { index: false }
      serveRoot: '/uploads/',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
