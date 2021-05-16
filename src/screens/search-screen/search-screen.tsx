import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Screen } from '../../components/screen/screen';
import { SearchBar } from '../../components/searchbar/searchbar';
import { useStores } from '../../models';
import usePlacesAutoComplete from '../../services/usePlacesAutocomplete';
import { color, spacing } from '../../theme';

export const SearchScreen = () => {
  const navigation = useNavigation();
  const store = useStores();
  const goBack = () => navigation.goBack();
  const { data, loading, error, setSearchString } = usePlacesAutoComplete();

  const onTextChange = (searchString: string) => {
    setSearchString(searchString);
  };

  const onItemClicked = (city: string) => {
    store.addToRecentSearch(city);
    store.setCityInfo(city, '');
    goBack();
  };

  console.log('render');
  return (
    <View testID="searchSreen" style={{ flex: 1 }}>
      <Screen
        style={styles.screenStyle}
        preset="fixed"
        backgroundColor={color.transparent}>
        <SearchBar
          placeholder="Search for city"
          onBackPress={goBack}
          onTextChange={onTextChange}
        />
        {loading ? (
          <ActivityIndicator size="small" style={{ marginTop: 16 }} />
        ) : error.error ? (
          <Text>{`Error: ${error.error_message}`}</Text>
        ) : data.length === 0 ? (
          <View style={{ justifyContent: 'center' }}>
            <Text style={styles.recentSearchLabel}>Recent Searches</Text>
            {store.recentSearches.map((recentSearch, index) => (
              <Pressable
                key={index}
                onPress={() => onItemClicked(recentSearch)}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                  },
                  {
                    marginTop: 1,
                    height: 48,
                    justifyContent: 'center',
                  },
                ]}>
                <Text style={{ paddingLeft: 16 }}>{recentSearch}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <ScrollView
            style={styles.scrollContainer}
            keyboardShouldPersistTaps={'always'}>
            {data.map((city, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                  },
                  {
                    marginTop: 1,
                    height: 48,
                    justifyContent: 'center',
                  },
                ]}
                onPress={() => onItemClicked(city)}>
                <Text style={{ paddingLeft: 16 }}>{city}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </Screen>
    </View>
  );
};

const styles = StyleSheet.create({
  screenStyle: {
    backgroundColor: color.transparent,
    paddingHorizontal: spacing[2],
  },
  scrollContainer: {
    flex: 1,
  },
  recentSearchLabel: {
    color: 'grey',
    fontSize: 14,
    paddingLeft: 4,
    marginBottom: 8,
  },
});
