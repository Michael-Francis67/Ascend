import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Post()
  create(@Body() dto: CreateSettingDto) {
    return this.settingsService.create(dto);
  }

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @Get('group/:group')
  findByGroup(@Param('group') group: string) {
    return this.settingsService.findByGroup(group);
  }

  @Get('company-info')
  @Public()
  getCompanyInfo() {
    return this.settingsService.getCompanyInfo();
  }

  @Get('social-links')
  @Public()
  getSocialLinks() {
    return this.settingsService.getSocialLinks();
  }

  @Get('branding')
  @Public()
  getBranding() {
    return this.settingsService.getBranding();
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.settingsService.findOne(key);
  }

  @Put(':key')
  update(@Param('key') key: string, @Body() dto: UpdateSettingDto) {
    return this.settingsService.update(key, dto);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.settingsService.remove(key);
  }

  @Post('company-info')
  updateCompanyInfo(@Body() data: any) {
    return this.settingsService.updateCompanyInfo(data);
  }

  @Post('social-links')
  updateSocialLinks(@Body() data: any) {
    return this.settingsService.updateSocialLinks(data);
  }

  @Post('branding')
  updateBranding(@Body() data: any) {
    return this.settingsService.updateBranding(data);
  }
}
