import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! A new Change...';
  }

  greet(): string{
    return "no grettings..."
  }
}
