import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Migration: Migrate firstName/lastName to fullName
 *
 * This migration:
 * 1. Adds fullName column as nullable
 * 2. Updates existing rows to concatenate firstName + lastName into fullName
 * 3. Makes fullName NOT NULL
 * 4. Drops firstName and lastName columns
 */
export class MigrateFullname1703360000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Add fullName column as nullable
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "fullName" VARCHAR
    `);

    // Step 2: Update existing rows to concatenate firstName + lastName
    await queryRunner.query(`
      UPDATE "users" 
      SET "fullName" = CONCAT("firstName", ' ', "lastName")
      WHERE "firstName" IS NOT NULL AND "lastName" IS NOT NULL
    `);

    // Step 3: Handle rows where only firstName exists
    await queryRunner.query(`
      UPDATE "users" 
      SET "fullName" = "firstName"
      WHERE "fullName" IS NULL AND "firstName" IS NOT NULL
    `);

    // Step 4: Set default for any remaining null values
    await queryRunner.query(`
      UPDATE "users" 
      SET "fullName" = 'User'
      WHERE "fullName" IS NULL
    `);

    // Step 5: Make fullName NOT NULL
    await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "fullName" SET NOT NULL
    `);

    // Step 6: Drop firstName and lastName columns
    await queryRunner.query(`
      ALTER TABLE "users" 
      DROP COLUMN "firstName",
      DROP COLUMN "lastName"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Add firstName and lastName columns
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "firstName" VARCHAR,
      ADD COLUMN "lastName" VARCHAR
    `);

    // Step 2: Split fullName back into firstName and lastName
    // This is a simple split - takes first word as firstName, rest as lastName
    await queryRunner.query(`
      UPDATE "users" 
      SET 
        "firstName" = SPLIT_PART("fullName", ' ', 1),
        "lastName" = CASE 
          WHEN POSITION(' ' IN "fullName") > 0 
          THEN SUBSTRING("fullName" FROM POSITION(' ' IN "fullName") + 1)
          ELSE ''
        END
      WHERE "fullName" IS NOT NULL
    `);

    // Step 3: Make firstName and lastName NOT NULL
    await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "firstName" SET NOT NULL,
      ALTER COLUMN "lastName" SET NOT NULL
    `);

    // Step 4: Drop fullName column
    await queryRunner.query(`
      ALTER TABLE "users" 
      DROP COLUMN "fullName"
    `);
  }
}
