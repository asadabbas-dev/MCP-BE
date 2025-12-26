import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

/**
 * Student Guard
 * 
 * Guard to protect routes that require student role.
 * Checks if the authenticated user has student role.
 */
@Injectable()
export class StudentGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    if (user.role !== 'student') {
      throw new ForbiddenException('Student access required');
    }

    return true;
  }
}

