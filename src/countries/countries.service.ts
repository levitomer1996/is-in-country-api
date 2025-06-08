import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from './schemas/country.schema';

import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, multiPolygon } from '@turf/helpers';
import { CreateCountryDto } from './dto/create-country.dto';

@Injectable()
export class CountriesService {
  private readonly logger = new Logger(CountriesService.name);

  constructor(
    @InjectModel(Country.name) private countryModel: Model<Country>,
  ) {}

  async getAllCountries() {
    this.logger.log('Fetching all countries...');
    return this.countryModel.find();
  }

  async isInCountry(lat: number, lng: number, code: string): Promise<boolean> {
    this.logger.log(
      `Checking if (${lat}, ${lng}) is inside country code: ${code}`,
    );

    const country = await this.countryModel.findOne({ code });

    if (!country) {
      this.logger.warn(`Country with code "${code}" not found`);
      throw new NotFoundException(`Country with code "${code}" not found`);
    }

    if (
      !country.geoJson ||
      country.geoJson.type !== 'MultiPolygon' ||
      !Array.isArray(country.geoJson.coordinates)
    ) {
      this.logger.error(`Invalid GeoJSON for country code "${code}"`);
      throw new BadRequestException(`Invalid GeoJSON for country "${code}"`);
    }

    const turfPoint = point([lng, lat]); // Note: [longitude, latitude]
    const turfMultiPolygon = multiPolygon(country.geoJson.coordinates);

    const result = booleanPointInPolygon(turfPoint, turfMultiPolygon);
    this.logger.log(`Point (${lat}, ${lng}) is inside "${code}": ${result}`);
    return result;
  }

  async createCountry(dto: CreateCountryDto) {
    this.logger.log(`Creating country: ${dto.name} (${dto.code})`);
    return this.countryModel.create(dto);
  }
}
