# Quick Fix for fullName Migration Error

## Problem
```
QueryFailedError: column "fullName" of relation "users" contains null values
```

This happens because TypeORM tries to add `fullName` column but existing rows have `firstName`/`lastName`.

## Solution: Run SQL Script

**Option 1: Using psql (Recommended)**
```bash
psql -U postgres -d mcp_db -f fix-fullname.sql
```

**Option 2: Using pgAdmin or DBeaver**
1. Open your database client
2. Connect to `mcp_db` database
3. Run the SQL from `fix-fullname.sql` file

**Option 3: Manual SQL**
Copy and paste this into your database client:

```sql
-- Add fullName column
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "fullName" VARCHAR;

-- Update existing rows
UPDATE "users" 
SET "fullName" = CONCAT("firstName", ' ', "lastName")
WHERE "firstName" IS NOT NULL AND "lastName" IS NOT NULL;

UPDATE "users" 
SET "fullName" = "firstName"
WHERE "fullName" IS NULL AND "firstName" IS NOT NULL;

UPDATE "users" 
SET "fullName" = 'User'
WHERE "fullName" IS NULL;

-- Make NOT NULL
ALTER TABLE "users" ALTER COLUMN "fullName" SET NOT NULL;

-- Drop old columns
ALTER TABLE "users" 
DROP COLUMN IF EXISTS "firstName",
DROP COLUMN IF EXISTS "lastName";
```

## After Running SQL

1. **Re-enable synchronize** (if you want):
   - Edit `src/config/typeorm.config.ts`
   - Set `synchronize: true` (for development)

2. **Restart the backend server:**
   ```bash
   npm run start:dev
   ```

3. **Run the admin seeder:**
   ```bash
   npm run seed
   ```

## Alternative: Reset Database (Development Only)

If you don't mind losing data:

```sql
DROP DATABASE mcp_db;
CREATE DATABASE mcp_db;
```

Then restart the server with `synchronize: true` - it will recreate all tables.

