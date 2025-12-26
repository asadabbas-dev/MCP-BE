import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatbotService {
  async getResponse(message: string): Promise<string> {
    // Basic rule-based responses
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('course') || lowerMessage.includes('enroll')) {
      return 'To enroll in a course, go to the Courses page and click "Enroll in Course". Select your semester and section, then submit.';
    }

    if (lowerMessage.includes('assignment') || lowerMessage.includes('submit')) {
      return 'To submit an assignment, go to the Assignments page, find your assignment, and click "Submit". Upload your file and add any comments.';
    }

    if (lowerMessage.includes('result') || lowerMessage.includes('grade') || lowerMessage.includes('cgpa')) {
      return 'You can view your results and CGPA on the Results page. It shows your DMC (Detailed Marks Certificate) and grade history.';
    }

    if (lowerMessage.includes('fee') || lowerMessage.includes('payment')) {
      return 'To pay fees, go to the Fees page. You can see pending fees and payment history. Click "Pay Now" to make a payment.';
    }

    if (lowerMessage.includes('library') || lowerMessage.includes('book')) {
      return 'To borrow a book, go to the Library page and search for books. Click "Borrow" on the book you want.';
    }

    if (lowerMessage.includes('timetable') || lowerMessage.includes('schedule')) {
      return 'Your class timetable is available on the Timetable page. It shows all your classes for the current semester.';
    }

    return 'I can help you with course enrollment, assignments, results, fees, library, and timetable. What would you like to know?';
  }
}

