import { Instance, SnapshotOut, types } from 'mobx-state-tree';

const TempModel = types.model('Temp').props({
  /**
   * Day temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
   */
  day: types.maybe(types.number),
  /**
   * Min daily temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
   */
  min: types.maybe(types.number),
  /**
   * Max daily temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
   */
  max: types.maybe(types.number),
  /**
   * Night temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
   */
  night: types.maybe(types.number),
  /**
   * Evening temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
   */
  eve: types.maybe(types.number),
  /**
   * Morning temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
   */
  morn: types.maybe(types.number),
});

const FeelsLikeModel = types.model('FeelsLike').props({
  /**
   * Day temperature.This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
   */
  day: types.maybe(types.number),
  /**
   * Night temperature.This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
   */
  night: types.maybe(types.number),
  /**
   * Evening temperature.This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
   */
  eve: types.maybe(types.number),
  /**
   * Morning temperature. This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
   */
  morn: types.maybe(types.number),
});

const WeatherModel = types.model('Weather').props({
  /**
   * Weather condition id
   */
  id: types.maybe(types.number),
  /**
   * Group of weather parameters (Rain, Snow, Extreme etc.)
   */
  main: types.maybe(types.string),
  /**
   * Weather condition within the group. You can get the output in your language
   */
  description: types.maybe(types.string),
  /**
   * Weather icon id
   */
  icon: types.maybe(types.string),
});

/**
 * Weather forecast for a day
 */
export const WeatherForecastModel = types
  .model('WeatherForecast')
  .props({
    /**
     * Time of data forecasted
     */
    dt: types.maybe(types.number),
    /**
     * Sunrise time
     */
    sunrise: types.maybe(types.number),
    /**
     * Sunset time
     */
    sunset: types.maybe(types.number),
    /**
     * Temparature information for the day
     */
    temp: types.maybe(TempModel),
    /**
     * human perception of weather.
     */
    feels_like: types.maybe(FeelsLikeModel),
    /**
     * Atmospheric pressure on the sea level, hPa
     */
    pressure: types.maybe(types.number),
    /**
     * Humidity, %
     */
    humidity: types.maybe(types.number),
    /**
     * (more info Weather condition codes)
     */
    weather: types.optional(types.array(WeatherModel), []),
    /**
     * Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour.
     */
    speed: types.maybe(types.number),
    /**
     * Wind direction, degrees (meteorological)
     */
    deg: types.maybe(types.number),
    /**
     * Cloudiness, %
     */
    clouds: types.maybe(types.number),
    /**
     * Probability of precipitation
     */
    pop: types.maybe(types.number),
    /**
     * Precipitation volume, mm
     */
    rain: types.maybe(types.number),
    /**
     * Snow volume, mm
     */
    snow: types.maybe(types.number),
  })
  .views((self) => ({
    get forecastedAt() {
      return new Date(self.dt! * 1000).toString();
    },
    get currentTemperature() {
      // TODO
      // find temperature based on whether it is morning, evening, day or night using sunrise and sunset
      // morning: from sunrise to 11:59am
      // day: from 12:00pm to 5:00pm
      // evening: 5:00pm to sunset
      // night: sunset to sunrise
      return self.temp?.day + '°C';
    },
    get humidityInPercent() {
      return self.humidity + '%';
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})); // eslint-disable-line @typescript-eslint/no-unused-vars

/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type WeatherForecastType = Instance<typeof WeatherForecastModel>;
export interface WeatherForecast extends WeatherForecastType {}
type WeatherForecastSnapshotType = SnapshotOut<typeof WeatherForecastModel>;
export interface WeatherForecastSnapshot extends WeatherForecastSnapshotType {}
