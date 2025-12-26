import { DataSource } from 'typeorm';
import { seedAdmin } from './admin.seed';
import { typeOrmConfig } from '../../config/typeorm.config';

/**
 * Database Seeder Runner
 * 
 * This script runs all database seeders.
 * Run this script to populate the database with initial data.
 * 
 * Usage:
 *   npm run seed
 *   or
 *   ts-node src/database/seeds/run-seed.ts
 */

async function runSeeders() {
  // Create DataSource connection
  const dataSource = new DataSource(typeOrmConfig() as any);

  try {
    // Initialize connection
    await dataSource.initialize();
    console.log('📦 Database connection established');

    // Run seeders
    console.log('\n🌱 Running seeders...\n');
    
    await seedAdmin(dataSource);

    console.log('\n✅ All seeders completed successfully!');
  } catch (error) {
    console.error('❌ Error running seeders:', error);
    process.exit(1);
  } finally {
    // Close connection
    await dataSource.destroy();
    console.log('📦 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  runSeeders();
}

export { runSeeders };

