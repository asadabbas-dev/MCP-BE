import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

/**
 * Teacher Guard
 * 
 * Guard to protect routes that require teacher role.
 * Checks if the authenticated user has teacher role.
 */
@Injectable()
export class TeacherGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    if (user.role !== 'teacher') {
      throw new ForbiddenException('Teacher access required');
    }

    return true;
  }
}

