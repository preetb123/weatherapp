import { GeneralApiProblem } from './api-problem';
import { WeatherForecastSnapshot } from '../../models';

export type GetWeatherForecastResult =
  | { kind: 'ok'; weatherForecasts: WeatherForecastSnapshot[] }
  | GeneralApiProblem;
