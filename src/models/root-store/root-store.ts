import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
import {
  WeatherForecast,
  WeatherForecastModel,
  WeatherForecastSnapshot,
} from '../weather-forecast/weather-forecast';
import { GetWeatherForecastResult } from '../../services/api';
import { withEnvironment } from '../extensions/with-environment';

const CityInfoModel = types.model('CityInfo', {
  city: types.string,
  formattedAddress: types.maybe(types.string),
});

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model('RootStore').props({
  weatherForecasts: types.optional(types.array(WeatherForecastModel), []),
  searches: types.optional(types.array(types.string), []),
  cityInfo: types.maybe(CityInfoModel),
})
.extend(withEnvironment)
.views((self) => ({
  get recentSearches(){
    return self.searches;
  },
  get currentCityInfo(){
    return self.cityInfo;
  },
}))
.volatile((self) => ({
  isLoading: false,
}))
.actions(self => ({
  saveWeatherForecasts: (weatherForecasts: WeatherForecastSnapshot[]) => {
    const forecasts: WeatherForecast[] = weatherForecasts.map(forecast => WeatherForecastModel.create(forecast));
    self.weatherForecasts.replace(forecasts);
  },
}))
.actions(self => ({
  getWeatherForecast: flow(function*(city: string) {
    console.log('getting weather forecast: ', city)
    self.isLoading = true;
    const result: GetWeatherForecastResult = yield self.environment.api.getWeatherForecast(city);
    // const result: GetWeatherForecastResult = yield new Promise((res, rej) => {
    //   setTimeout(() => res({kind:"ok", weatherForecasts:[
    //     {
    //       "dt": 1608877800,
    //       "sunrise": 1608860489,
    //       "sunset": 1608897646,
    //       "temp": {
    //         "day": 19.77,
    //         "min": 14,
    //         "max": 22.33,
    //         "night": 16.62,
    //         "eve": 19.02,
    //         "morn": 14.27
    //       },
    //       "feels_like": {
    //         "day": 15.85,
    //         "night": 13.24,
    //         "eve": 14.43,
    //         "morn": 10.95
    //       },
    //       "pressure": 1018,
    //       "humidity": 26,
    //       "weather": [
    //         {
    //           "id": 800,
    //           "main": "Clear",
    //           "description": "sky is clear",
    //           "icon": "01d"
    //         }
    //       ],
    //       "speed": 2.71,
    //       "deg": 315,
    //       "clouds": 0,
    //       "pop": 0
    //     },
    //     {
    //       "dt": 1608964200,
    //       "sunrise": 1608946913,
    //       "sunset": 1608984080,
    //       "temp": {
    //         "day": 19.5,
    //         "min": 13.53,
    //         "max": 22.2,
    //         "night": 17.07,
    //         "eve": 20.26,
    //         "morn": 13.94
    //       },
    //       "feels_like": {
    //         "day": 15.38,
    //         "night": 14.04,
    //         "eve": 16.57,
    //         "morn": 10.22
    //       },
    //       "pressure": 1017,
    //       "humidity": 25,
    //       "weather": [
    //         {
    //           "id": 800,
    //           "main": "Clear",
    //           "description": "sky is clear",
    //           "icon": "01d"
    //         }
    //       ],
    //       "speed": 2.83,
    //       "deg": 293,
    //       "clouds": 4,
    //       "pop": 0
    //     }]}), 5000)
    // })
    self.isLoading = false;
    if (result.kind === 'ok'){
      console.log('adding results to store')
      self.saveWeatherForecasts(result.weatherForecasts);
    } else {

    }
  }),
  addToRecentSearch(searchString: string){
    if(self.searches.length === 5){
      self.searches.pop();
    }
    self.searches.unshift(searchString);
  },
  setCityInfo(city: string, formattedAddress: string){
    self.cityInfo = CityInfoModel.create({city, formattedAddress});
    this.getWeatherForecast(city);
  },
}));

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
