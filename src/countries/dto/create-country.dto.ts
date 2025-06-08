export class CreateCountryDto {
  name: string;
  code: string;
  geoJson: {
    type: string; // must be 'MultiPolygon'
    coordinates: number[][][][]; // list of polygons
  };
}
