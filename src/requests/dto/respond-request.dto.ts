import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RespondRequestDto {
  @ApiProperty({ description: 'Response text' })
  @IsNotEmpty()
  @IsString()
  response: string;

  @ApiProperty({ description: 'Request status', enum: ['pending', 'in_progress', 'resolved', 'rejected'] })
  @IsNotEmpty()
  @IsEnum(['pending', 'in_progress', 'resolved', 'rejected'])
  status: string;
}

