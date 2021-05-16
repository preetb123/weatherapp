import { useEffect, useState } from 'react';

import { PLACES_API } from '@env';
import { useCurrentLocation } from './useCurrentLocation';

export interface GeocodeResult {
  plus_code: PlusCode;
  results: Result[];
  status: string;
}

export interface PlusCode {
  compound_code: string;
  global_code: string;
}

export interface Result {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  types: string[];
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface Geometry {
  bounds: Bounds;
  location: Location;
  location_type: string;
  viewport: Viewport;
}

export interface Bounds {
  northeast: Northeast;
  southwest: Southwest;
}

export interface Northeast {
  lat: number;
  lng: number;
}

export interface Southwest {
  lat: number;
  lng: number;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Viewport {
  northeast: Northeast2;
  southwest: Southwest2;
}

export interface Northeast2 {
  lat: number;
  lng: number;
}

export interface Southwest2 {
  lat: number;
  lng: number;
}

export const useCurrentCity = (): [string, string, boolean, string] => {
  const [location, loading, error] = useCurrentLocation();

  const [currentCity, setCurrentCity] = useState<string>('');
  const [formattedAddress, setFormattedAddress] = useState('');
  const [addressLoading, setAddressLoading] = useState(true);
  const [geocodeError, setGeocodingError] = useState('');

  useEffect(() => {
    console.log(loading);
    async function reverseGeocode(latitude: number, longitude: number) {
      console.log('lat: ', latitude, ' lon: ', longitude, addressLoading);
      setAddressLoading(true);
      const result = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&result_type=locality&key=${PLACES_API}`,
      );
      const geocodedResult: GeocodeResult = await result.json();
      if (geocodedResult.status === 'OK') {
        let city = geocodedResult.results[0].address_components[0].long_name;
        let address = geocodedResult.results[0].formatted_address;

        setAddressLoading(false);
        setGeocodingError('');

        setCurrentCity(city);
        //setFormattedAddress(address);
        console.log(city, formattedAddress, addressLoading);
      } else {
        let errorMessage = '';
        switch (geocodedResult.status) {
          case 'ZERO_RESULTS':
            errorMessage = 'No Results found';
            break;
          case 'INVALID_REQUEST':
            errorMessage = 'Request is missing input parameters';
            break;
          case 'OVER_QUERY_LIMIT':
            errorMessage = 'No Result found';
            break;
          case 'REQUEST_DENIED':
            errorMessage = 'Invalid key provided with request';
            break;
          default:
            // UNKNWON ERROR
            errorMessage = 'Uknown error, please try again';
            break;
        }
        console.log('Error: ', errorMessage);
        setGeocodingError(errorMessage);
        setAddressLoading(false);
      }
    }
    if (!loading) {
      console.log('reverseGeocoding: ', location);
      reverseGeocode(location.latitude, location.longitude);
    }
  }, [loading]);

  return [currentCity, formattedAddress, addressLoading, geocodeError];
};
