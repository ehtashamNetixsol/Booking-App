import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class WriterAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user = context.switchToHttp().getRequest().user;

    if (user && user.role === 'admin') {
      return true;
    }
    if (user && user.role === 'writer') {
      return true;
    }

    throw new UnauthorizedException('Writer or admin privileges required');
  }
}
