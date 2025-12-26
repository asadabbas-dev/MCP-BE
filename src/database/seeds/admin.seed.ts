import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../../users/entities/user.entity";

/**
 * Admin Seeder
 *
 * Seeds the database with an initial admin user.
 * Run this seeder to create the first admin account.
 *
 * Usage:
 * - Import and run in main.ts during development
 * - Or create a separate script to run the seeder
 */

export async function seedAdmin(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  // Check if admin already exists
  const existingAdmin = await userRepository.findOne({
    where: { email: "admin@mcp.com" },
  });

  if (existingAdmin) {
    console.log("✅ Admin user already exists");
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = userRepository.create({
    email: "admin@mcp.com",
    password: hashedPassword,
    fullName: "Admin User",
    role: "admin",
    isActive: true,
  });

  await userRepository.save(admin);

  console.log("✅ Admin user created successfully");
  console.log("📧 Email: admin@mcp.com");
  console.log("🔑 Password: admin123");
  console.log("⚠️  Please change the password after first login!");
}

/**
 * Run seeder manually
 *
 * This function can be called from a script or during application startup
 */
export async function runAdminSeeder() {
  // This would be called with the DataSource from your app
  // Example usage in main.ts or a separate script
}
