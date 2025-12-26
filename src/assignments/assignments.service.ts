import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { AssignmentSubmission } from './entities/assignment-submission.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { GradeAssignmentDto } from './dto/grade-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentsRepository: Repository<Assignment>,
    @InjectRepository(AssignmentSubmission)
    private submissionsRepository: Repository<AssignmentSubmission>,
  ) {}

  // Assignment CRUD
  async create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    if (!createAssignmentDto.teacherId) {
      throw new BadRequestException('Teacher ID is required');
    }
    const assignment = this.assignmentsRepository.create({
      ...createAssignmentDto,
      dueDate: new Date(createAssignmentDto.dueDate),
    });
    return this.assignmentsRepository.save(assignment);
  }

  async findAll(): Promise<Assignment[]> {
    return this.assignmentsRepository.find({
      relations: ['teacher', 'teacher.user', 'course'],
      order: { dueDate: 'ASC' },
    });
  }

  async findByCourse(courseId: string): Promise<Assignment[]> {
    return this.assignmentsRepository.find({
      where: { courseId },
      relations: ['teacher', 'teacher.user', 'course'],
      order: { dueDate: 'ASC' },
    });
  }

  async findByTeacher(teacherId: string): Promise<Assignment[]> {
    return this.assignmentsRepository.find({
      where: { teacherId },
      relations: ['teacher', 'teacher.user', 'course'],
      order: { dueDate: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Assignment> {
    const assignment = await this.assignmentsRepository.findOne({
      where: { id },
      relations: ['teacher', 'teacher.user', 'course', 'submissions', 'submissions.student'],
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return assignment;
  }

  // Submission methods
  async submitAssignment(studentId: string, submitDto: SubmitAssignmentDto): Promise<AssignmentSubmission> {
    const assignment = await this.findOne(submitDto.assignmentId);

    // Check if already submitted
    const existing = await this.submissionsRepository.findOne({
      where: { studentId, assignmentId: submitDto.assignmentId },
    });

    if (existing) {
      throw new BadRequestException('Assignment already submitted');
    }

    const submission = this.submissionsRepository.create({
      ...submitDto,
      studentId,
    });

    return this.submissionsRepository.save(submission);
  }

  async getSubmissions(assignmentId: string): Promise<AssignmentSubmission[]> {
    return this.submissionsRepository.find({
      where: { assignmentId },
      relations: ['student', 'student.user'],
      order: { submittedAt: 'DESC' },
    });
  }

  async getStudentSubmissions(studentId: string): Promise<AssignmentSubmission[]> {
    return this.submissionsRepository.find({
      where: { studentId },
      relations: ['assignment', 'assignment.course'],
      order: { submittedAt: 'DESC' },
    });
  }

  async gradeSubmission(submissionId: string, gradeDto: GradeAssignmentDto): Promise<AssignmentSubmission> {
    const submission = await this.submissionsRepository.findOne({
      where: { id: submissionId },
      relations: ['assignment'],
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (gradeDto.marksObtained > submission.assignment.totalMarks) {
      throw new BadRequestException('Marks cannot exceed total marks');
    }

    submission.marksObtained = gradeDto.marksObtained;
    submission.feedback = gradeDto.feedback;
    submission.isGraded = true;

    return this.submissionsRepository.save(submission);
  }
}

