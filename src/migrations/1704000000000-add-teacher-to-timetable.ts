import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddTeacherToTimetable1704000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add teacherId column to timetable table
    await queryRunner.addColumn(
      'timetable',
      new TableColumn({
        name: 'teacherId',
        type: 'uuid',
        isNullable: true, // Allow null initially for existing records
      }),
    );

    // Add foreign key constraint
    await queryRunner.createForeignKey(
      'timetable',
      new TableForeignKey({
        columnNames: ['teacherId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'teachers',
        onDelete: 'CASCADE',
      }),
    );

    // For existing records, try to set teacherId from the course's teacher
    // This is a best-effort migration - some records might remain null
    await queryRunner.query(`
      UPDATE timetable t
      SET "teacherId" = c."teacherId"
      FROM courses c
      WHERE t."courseId" = c.id
      AND c."teacherId" IS NOT NULL
      AND t."teacherId" IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove foreign key
    const table = await queryRunner.getTable('timetable');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('teacherId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('timetable', foreignKey);
    }

    // Remove column
    await queryRunner.dropColumn('timetable', 'teacherId');
  }
}

