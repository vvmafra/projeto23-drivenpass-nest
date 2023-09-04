import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("App")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("health")
  @ApiOperation({
    summary: "Checks APIs health",
    description: "Checks if the API is working well"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "API is okay"
  })
  getHello(): string {
    return this.appService.getHealth();
  }
}
