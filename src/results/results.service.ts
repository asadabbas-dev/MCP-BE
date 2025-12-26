import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from './entities/grade.entity';
import { CreateGradeDto } from './dto/create-grade.dto';
import { Student } from '../students/entities/student.entity';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Grade)
    private gradesRepository: Repository<Grade>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async create(createGradeDto: CreateGradeDto): Promise<Grade> {
    const percentage = (createGradeDto.marksObtained / createGradeDto.totalMarks) * 100;
    const { letterGrade, gradePoints } = this.calculateGrade(percentage);

    const grade = this.gradesRepository.create({
      ...createGradeDto,
      percentage,
      letterGrade,
      gradePoints,
    });

    const savedGrade = await this.gradesRepository.save(grade);
    await this.updateCGPA(createGradeDto.studentId);
    return savedGrade;
  }

  async findByStudent(studentId: string): Promise<Grade[]> {
    return this.gradesRepository.find({
      where: { studentId },
      relations: ['course'],
      order: { semester: 'DESC', createdAt: 'DESC' },
    });
  }

  async findBySemester(studentId: string, semester: string): Promise<Grade[]> {
    return this.gradesRepository.find({
      where: { studentId, semester },
      relations: ['course'],
      order: { createdAt: 'ASC' },
    });
  }

  async calculateCGPA(studentId: string): Promise<number> {
    const grades = await this.gradesRepository.find({
      where: { studentId },
      relations: ['course'],
    });

    if (grades.length === 0) return 0;

    let totalPoints = 0;
    let totalCredits = 0;

    for (const grade of grades) {
      const credits = grade.course?.creditHours || 3;
      totalPoints += grade.gradePoints * credits;
      totalCredits += credits;
    }

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  }

  private async updateCGPA(studentId: string): Promise<void> {
    const cgpa = await this.calculateCGPA(studentId);
    await this.studentsRepository.update(studentId, { cgpa });
  }

  private calculateGrade(percentage: number): { letterGrade: string; gradePoints: number } {
    if (percentage >= 90) return { letterGrade: 'A+', gradePoints: 4.0 };
    if (percentage >= 85) return { letterGrade: 'A', gradePoints: 4.0 };
    if (percentage >= 80) return { letterGrade: 'A-', gradePoints: 3.7 };
    if (percentage >= 75) return { letterGrade: 'B+', gradePoints: 3.3 };
    if (percentage >= 70) return { letterGrade: 'B', gradePoints: 3.0 };
    if (percentage >= 65) return { letterGrade: 'B-', gradePoints: 2.7 };
    if (percentage >= 60) return { letterGrade: 'C+', gradePoints: 2.3 };
    if (percentage >= 55) return { letterGrade: 'C', gradePoints: 2.0 };
    if (percentage >= 50) return { letterGrade: 'C-', gradePoints: 1.7 };
    if (percentage >= 45) return { letterGrade: 'D', gradePoints: 1.0 };
    return { letterGrade: 'F', gradePoints: 0.0 };
  }
}

