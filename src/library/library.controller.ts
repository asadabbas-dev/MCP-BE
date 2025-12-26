import { Controller, Get, Post, Param, Patch, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LibraryService } from './library.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { StudentGuard } from '../common/guards/student.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('library')
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('books')
  @ApiOperation({ summary: 'Get all books' })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({ status: 200, description: 'List of books' })
  getBooks(@Query('search') search?: string) {
    if (search) {
      return this.libraryService.searchBooks(search);
    }
    return this.libraryService.findAllBooks();
  }

  @Post('books/:bookId/borrow')
  @UseGuards(JwtAuthGuard, StudentGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Borrow book (Student only)' })
  @ApiResponse({ status: 201, description: 'Book borrowed' })
  @ApiResponse({ status: 403, description: 'Forbidden - Student access required' })
  borrowBook(@Param('bookId') bookId: string, @CurrentUser() user: any) {
    const studentId = user.studentId || user.student?.id;
    if (!studentId) {
      throw new Error('Student ID not found. Only students can borrow books.');
    }
    return this.libraryService.borrowBook(bookId, studentId);
  }

  @Get('borrowings')
  @UseGuards(JwtAuthGuard, StudentGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get student borrowings (Student only)' })
  @ApiResponse({ status: 200, description: 'List of borrowings' })
  @ApiResponse({ status: 403, description: 'Forbidden - Student access required' })
  getBorrowings(@CurrentUser() user: any) {
    const studentId = user.studentId || user.student?.id;
    if (!studentId) {
      throw new Error('Student ID not found.');
    }
    return this.libraryService.getStudentBorrowings(studentId);
  }

  @Patch('borrowings/:id/return')
  @UseGuards(JwtAuthGuard, StudentGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Return book (Student only)' })
  @ApiResponse({ status: 200, description: 'Book returned' })
  @ApiResponse({ status: 403, description: 'Forbidden - Student access required' })
  returnBook(@Param('id') id: string) {
    return this.libraryService.returnBook(id);
  }
}

