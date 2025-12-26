import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { ResultsModule } from './results/results.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TimetableModule } from './timetable/timetable.module';
import { LibraryModule } from './library/library.module';
import { ForumModule } from './forum/forum.module';
import { LostFoundModule } from './lost-found/lost-found.module';
import { RequestsModule } from './requests/requests.module';
import { FeedbackModule } from './feedback/feedback.module';
import { FeesModule } from './fees/fees.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    // Configuration module - loads environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM module - database connection
    TypeOrmModule.forRoot(typeOrmConfig()),

    // Feature modules
    AuthModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
    CoursesModule,
    EnrollmentsModule,
    ResultsModule,
    AssignmentsModule,
    NotificationsModule,
    TimetableModule,
    LibraryModule,
    ForumModule,
    LostFoundModule,
    RequestsModule,
    FeedbackModule,
    FeesModule,
    ChatbotModule,
  ],
})
export class AppModule {}

