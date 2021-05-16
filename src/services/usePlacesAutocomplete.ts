import { useEffect, useState } from 'react';
import { PLACES_API } from '@env';

export interface Response {
  predictions: Prediction[];
  status:
    | 'OK'
    | 'ZERO_RESULTS'
    | 'OVER_QUERY_LIMIT'
    | 'REQUEST_DENIED'
    | 'INVALID_REQUEST'
    | 'UNKNOWN_ERROR';
  error_message?: string;
}

export interface Prediction {
  description: string;
  matched_substrings: MatchedSubstring[];
  place_id: string;
  reference: string;
  structured_formatting: StructuredFormatting;
  terms: Term[];
  types: string[];
}

export interface MatchedSubstring {
  length: number;
  offset: number;
}

export interface StructuredFormatting {
  main_text: string;
  main_text_matched_substrings: MainTextMatchedSubstring[];
  secondary_text: string;
}

export interface MainTextMatchedSubstring {
  length: number;
  offset: number;
}

export interface Term {
  offset: number;
  value: string;
}

export default function usePlacesAutoComplete() {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [error, setError] = useState<{
    error?: boolean;
    error_message?: string;
  }>({ error: false });
  useEffect(() => {
    (async () => {
      if (searchString.length === 0) {
        setError({ error: false });
        setData([]);
        return;
      }
      setLoading(true);
      const result = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchString}&key=${PLACES_API}`,
      );
      const resp: Response = await result.json();
      setLoading(false);
      if (resp.status === 'OK') {
        const predictions: string[] = resp.predictions.map(
          (prediction) => prediction.structured_formatting.main_text,
        );
        setData(predictions);
        setError({ error: false });
      } else {
        let errorMessage = '';
        switch (resp.status) {
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
        setError({ error: true, error_message: errorMessage });
      }
    })();
  }, [searchString]);

  return { data, loading, error, setSearchString };
}
