import { useEffect, useState } from 'react';

import Geolocation from 'react-native-geolocation-service';
import { Linking, Alert } from 'react-native';

const hasLocationPermissionIOS = async () => {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings');
    });
  };
  console.log('asking location permission');
  const status = await Geolocation.requestAuthorization('whenInUse');
  console.log('status: ', status);
  if (status === 'granted') {
    return true;
  }

  if (status === 'denied') {
    Alert.alert('Location permission denied');
  }

  if (status === 'disabled') {
    Alert.alert(
      `Turn on Location Services to allow App to determine your location.`,
      '',
      [
        { text: 'Go to Settings', onPress: openSetting },
        { text: "Don't Use Location", onPress: () => {} },
      ],
    );
  }

  return false;
};

export const useCurrentLocation = () => {
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    accuracy: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getLocation = async () => {
    const hasLocationPermission = await hasLocationPermissionIOS();
    if (!hasLocationPermission) {
      return;
    }
    setLoading(true);
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({ ...position.coords });
        setLoading(false);
      },
      (error) => {
        Alert.alert(`Code ${error.code}`, error.message);
        console.log(error);
        setError(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
      },
    );
  };

  useEffect(() => {
    async function getCurrentLocation() {
      await getLocation();
    }
    getCurrentLocation();
  }, []);
  return [location, loading, error];
};
