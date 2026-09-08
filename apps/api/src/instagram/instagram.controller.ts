import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { InstagramService } from './instagram.service';

@ApiTags('instagram')
@Controller('instagram')
export class InstagramController {
  constructor(private readonly instagram: InstagramService) {}

  @Public()
  @Get()
  feed() {
    return this.instagram.getFeed();
  }
}
