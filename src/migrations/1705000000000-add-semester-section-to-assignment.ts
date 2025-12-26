import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSemesterSectionToAssignment1705000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add semester column to assignments table
    await queryRunner.addColumn(
      'assignments',
      new TableColumn({
        name: 'semester',
        type: 'varchar',
        isNullable: false,
        default: "'Fall 2024'", // Default value for existing records
      }),
    );

    // Add section column to assignments table (nullable - null means all sections)
    await queryRunner.addColumn(
      'assignments',
      new TableColumn({
        name: 'section',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove columns
    await queryRunner.dropColumn('assignments', 'section');
    await queryRunner.dropColumn('assignments', 'semester');
  }
}

