import { WeatherForecastModel, WeatherForecast } from './weather-forecast';

test('can be created', () => {
  const instance: WeatherForecast = WeatherForecastModel.create({
    dt: 1607668200,
    sunrise: 1607649724,
    sunset: 1607689865,
    temp: {
      day: 300.69,
      min: 292.99,
      max: 302.98,
      night: 294.29,
      eve: 300.95,
      morn: 293.31,
    },
    feels_like: {
      day: 299.82,
      night: 296.03,
      eve: 301.98,
      morn: 292.55,
    },
    pressure: 1014,
    humidity: 38,
    weather: [
      {
        id: 804,
        main: 'Clouds',
        description: 'overcast clouds',
        icon: '04d',
      },
    ],
    speed: 2.1,
    deg: 139,
    clouds: 99,
    pop: 0.02,
  });

  expect(instance).toBeTruthy();
});
