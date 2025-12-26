import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { DataSource } from "typeorm";
import { getDataSourceToken } from "@nestjs/typeorm";
import { seedAdmin } from "./database/seeds/admin.seed";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Run admin seeder on startup
  try {
    const dataSource = app.get<DataSource>(getDataSourceToken());
    await seedAdmin(dataSource);
  } catch (error) {
    console.error("❌ Error running admin seeder:", error.message);
  }

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3001",
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Global prefix for all routes
  app.setGlobalPrefix("api");

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle("My Class Portal (MCP) API")
    .setDescription(
      "API documentation for My Class Portal - Academic Management System"
    )
    .setVersion("1.0")
    .addTag("auth", "Authentication endpoints")
    .addTag("users", "User management endpoints")
    .addTag("courses", "Course management endpoints")
    .addTag("assignments", "Assignment management endpoints")
    .addTag("results", "Results and grades endpoints")
    .addTag("notifications", "Notification endpoints")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth" // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keep authorization token after page refresh
    },
  });

  const port = process.env.PORT || 5001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(
    `📚 Swagger API Documentation: http://localhost:${port}/api/docs`
  );
}

bootstrap();
