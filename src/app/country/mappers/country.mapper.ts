import { Country } from "../interfaces/country.interface";
import { RESTCountry } from "../interfaces/rest-countries.interface";

export class CountryMapper {
  // static RestCountry => Country
  static mapRestCountryToCountry(country: RESTCountry): Country {
    return {
      capital: country.capital.join(', '),
      cca2: country.cca2,
      flagSvg: country.flags.svg,
      flag: country.flag,
      population: country.population,
      region: country.region,
      subRegion: country.subregion,
      name: country.translations['spa'].common ?? 'No Spanish Name'
    };
  }
  // static RestCountry[] => Country[]
  static mapRestCountryArrayToCountryArray(dto: RESTCountry[]): Country[] {
    return dto.map((country) => this.mapRestCountryToCountry(country));
  }

  // Blog
//   static mapRestCountryArrayToCountryArray2(
//     restCountries: RESTCountry[]
//   ): Country[] {
//     return restCountries.map( (country) => this.mapRestCountryToCountry(country));
//   }

}