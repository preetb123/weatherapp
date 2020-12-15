import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
import {
  WeatherForecast,
  WeatherForecastModel,
  WeatherForecastSnapshot,
} from '../weather-forecast/weather-forecast';
import { GetWeatherForecastResult } from '../../services/api';
import { withEnvironment } from '../extensions/with-environment';

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model('RootStore').props({
  weatherForecasts: types.optional(types.array(WeatherForecastModel), []),
})
.extend(withEnvironment)
.actions(self => ({
  saveWeatherForecasts: (weatherForecasts: WeatherForecastSnapshot[]) => {
    const forecasts: WeatherForecast[] = weatherForecasts.map(forecast => WeatherForecastModel.create(forecast));
    self.weatherForecasts.replace(forecasts);
  },
}))
.actions(self => ({
  getWeatherForecast: flow(function*(city: string) {
    const result: GetWeatherForecastResult = yield self.environment.api.getWeatherForecast(city);
    if (result.kind === 'ok'){
      self.saveWeatherForecasts(result.weatherForecasts);
    } else {

    }
  })
}));

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
