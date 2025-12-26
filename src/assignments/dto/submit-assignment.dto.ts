import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitAssignmentDto {
  @ApiProperty({ description: 'Assignment ID' })
  @IsNotEmpty()
  @IsString()
  assignmentId: string;

  @ApiPropertyOptional({ description: 'File URL/path' })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiPropertyOptional({ description: 'File name' })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiPropertyOptional({ description: 'Submission comments' })
  @IsOptional()
  @IsString()
  comments?: string;
}

