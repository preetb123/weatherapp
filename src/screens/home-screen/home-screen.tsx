import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';
import {
  Text,
  Button,
  View,
  StyleSheet,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Screen } from '../../components/screen/screen';
import { useStores } from '../../models';

import { color, spacing } from '../../theme';
import { useCurrentCity } from '../../services/useCurrentCity';
import { TodaysWeatherItem } from '../../components/todays-weather/todays-weather-item';

export const HomeScreen = observer(() => {
  const navigation = useNavigation();
  const store = useStores();
  const [
    currentCity,
    formattedAddress,
    addressLoading,
    geocodeError,
  ] = useCurrentCity();
  console.log('checking city info');

  useEffect(() => {
    if (currentCity) {
      store.setCityInfo(currentCity, formattedAddress);
    }
  }, [currentCity]);

  if (!currentCity) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (store.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="small" />
        <Text>Fetching weather forecast</Text>
      </View>
    );
  }

  console.log('data loading boolean: ');

  const searcScreen = () => navigation.navigate('search');

  console.log('homescreen render');

  return (
    <View testID="home" style={styles.container}>
      <Screen
        style={styles.screenStyle}
        preset="fixed"
        backgroundColor={color.transparent}>
        <Text>{store.cityInfo?.city}</Text>
        <Button testID="searchButton" onPress={searcScreen} title="Search" />
        <TodaysWeatherItem />
        <ScrollView>
          {store.weatherForecasts.map((forecast) => (
            <View key={forecast.dt} style={styles.forecastItem}>
              <Text>{forecast.forecastedAt}</Text>
              <Text>{forecast.currentTemperature}</Text>
              <Text>{`Humidity: ${forecast.humidityInPercent}`}</Text>
              <Text>{`Wind: ${forecast.cardinalDirection()}`}</Text>
            </View>
          ))}
        </ScrollView>
      </Screen>
    </View>
  );
});

const styles = StyleSheet.create({
  screenStyle: {
    backgroundColor: color.transparent,
    paddingHorizontal: spacing[2],
  },
  forecastItem: {
    marginVertical: 4,
    backgroundColor: color.palette.lighterGrey,
  },
  container: {
    flex: 1,
  },
});
