import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getBillings(): string {
    return 'Hello World!';
  }
}
