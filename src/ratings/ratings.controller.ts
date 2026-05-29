import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() data: any) {
    return this.ratingsService.create(req.user.sub, data);
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.ratingsService.findByProject(projectId);
  }
}