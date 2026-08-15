import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateTeamMemberDto) {
    return this.teamService.create(dto);
  }

  @Get()
  findAll() {
    return this.teamService.findAll();
  }

  @Get('active')
  @Public()
  getActive() {
    return this.teamService.getActiveMembers();
  }

  @Get('role/:role')
  @Public()
  getByRole(@Param('role') role: string) {
    return this.teamService.getByRole(role);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateTeamMemberDto) {
    return this.teamService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.teamService.remove(id);
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard)
  toggleActive(@Param('id') id: string) {
    return this.teamService.toggleActive(id);
  }

  @Post('reorder')
  @UseGuards(JwtAuthGuard)
  reorder(@Body('ids') ids: string[]) {
    return this.teamService.reorder(ids);
  }
}
