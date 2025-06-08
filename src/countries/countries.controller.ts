import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';

@Controller('countries')
export class CountriesController {
  private readonly logger = new Logger(CountriesController.name);

  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async getCountries() {
    this.logger.log('GET /countries called');
    return this.countriesService.getAllCountries();
  }

  @Post('check-location')
  async checkLocation(
    @Body() body: { lat: number; lng: number; code: string },
  ) {
    this.logger.log(
      `POST /countries/check-location → lat: ${body.lat}, lng: ${body.lng}, code: ${body.code}`,
    );

    const { lat, lng, code } = body;
    const isInside = await this.countriesService.isInCountry(lat, lng, code);
    this.logger.log(`Result: ${isInside}`);
    return { inside: isInside };
  }

  @Post('/create')
  async createCountry(@Body() dto: CreateCountryDto) {
    this.logger.log(`POST /countries → Create ${dto.name} (${dto.code})`);
    return this.countriesService.createCountry(dto);
  }
}
