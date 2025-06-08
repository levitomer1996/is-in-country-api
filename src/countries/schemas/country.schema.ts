import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Country extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string; // e.g. "IL", "US"

  @Prop({ type: Object, required: true })
  geoJson: {
    type: string; // Should be 'MultiPolygon'
    coordinates: number[][][][]; // Nested lat/lngs
  };
}

export const CountrySchema = SchemaFactory.createForClass(Country);
