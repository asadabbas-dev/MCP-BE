import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostFoundService } from './lost-found.service';
import { LostFoundController } from './lost-found.controller';
import { LostFoundItem } from './entities/lost-found-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LostFoundItem])],
  controllers: [LostFoundController],
  providers: [LostFoundService],
  exports: [LostFoundService],
})
export class LostFoundModule {}

