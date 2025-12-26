import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Send message to chatbot' })
  @ApiResponse({ status: 200, description: 'Chatbot response' })
  async getResponse(@Body() body: { message: string }) {
    const response = await this.chatbotService.getResponse(body.message);
    return { response };
  }
}

