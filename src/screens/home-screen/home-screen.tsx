import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Text, Button, View, StatusBar, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Screen } from '../../components/screen/screen';
import { useStores } from '../../models';
import { color, spacing } from '../../theme';

export const HomeScreen = observer(() => {
  const navigation = useNavigation();
  const store = useStores();

  useEffect(() => {
    if (store.weatherForecasts.length === 0) {
      console.log('getting forecast');
      store.getWeatherForecast('Kolhapur');
    }
  }, []);

  const searcScreen = () => navigation.navigate('search');

  if (store.weatherForecasts.length === 0) return null;
  console.log('loaded', store.weatherForecasts.length);

  return (
    <View testID="home" style={{ flex: 1 }}>
      <Screen style={styles.screenStyle}>
        <Text>HomeScreen</Text>
        <Button testID="searchButton" onPress={searcScreen} title="Search" />
        <ScrollView style={styles.scrollContainer}>
          {store.weatherForecasts.map((forecast) => (
            <View key={forecast.dt} style={styles.forecastItem}>
              <Text>{forecast.forecastedAt}</Text>
              <Text>{forecast.currentTemperature}</Text>
              <Text>{`Humidity: ${forecast.humidityInPercent}`}</Text>
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
  scrollContainer: {},
});
