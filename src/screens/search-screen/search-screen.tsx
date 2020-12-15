import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, Button, View } from 'react-native';

export const SearchScreen = () => {
  const navigation = useNavigation();
  const goBack = () => navigation.goBack();
  return (
    <View testID="searchSreen" style={{ margin: 50 }}>
      <Text>SearchScreen</Text>
      <Button testID="back" onPress={goBack} title="Back" />
    </View>
  );
};
