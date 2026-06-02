import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RatingsService } from './ratings.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateRatingDto } from './dto/create-rating.dto';

@ApiTags('Ratings')
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Memberikan rating pada project' })
  @ApiResponse({ status: 201, description: 'Rating berhasil dibuat.' })
  @ApiResponse({ status: 400, description: 'Payload rating tidak valid.' })
  @ApiBody({ type: CreateRatingDto })
  create(@Request() req, @Body() data: CreateRatingDto) {
    return this.ratingsService.create(req.user.sub, data);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Mengambil rating berdasarkan project' })
  @ApiResponse({ status: 200, description: 'Rating project berhasil diambil.' })
  findByProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.ratingsService.findByProject(projectId);
  }
}