import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { registerRootComponent } from 'expo'; // import it explicitly
import getLocationAsync from './services/location';
import { LocationData } from 'expo-location';
import ModeSelector, { Modes } from './components/ModeSelector';
import OpenMapsButton from './components/OpenMapsButton';
import {
  SpaceLarge,
  SpaceXLarge,
  HighlightedTextColor,
} from './constants/designTokens';
import fetchStationsData, {
  StationInfo,
  StationsInfo,
} from './services/fetchStationsData';
import getClosestStation from './utils/getClosestStation';
import ErrorMessage from './components/ErrorMessage';
import { Error } from './constants/errors';
import { BackgroundBody } from './constants/designTokens';

const App = () => {
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [closestStation, setClosestStation] = React.useState<StationInfo>(null);
  const [error, setError] = React.useState<Error>(null);
  const [location, setLocation] = React.useState<LocationData>(null);
  const [mode, setMode] = React.useState<Modes>('RENT');

  React.useEffect(() => {
    (async (): Promise<void> => await getClosestStationData())();
  }, [mode]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await getClosestStationData();
    setRefreshing(false);
  }, [refreshing]);

  // Gets the station data and computes the closest station from the given location
  const getClosestStationData = async (): Promise<void> => {
    const maybeLocation = await getLocationAsync();
    if ((maybeLocation as Error).code) {
      return setError(maybeLocation as Error);
    }

    setLocation(maybeLocation as LocationData);

    const maybeStationsData = await fetchStationsData(mode);

    if ((maybeStationsData as Error).code)
      return setError(maybeStationsData as Error);

    const maybeClosestStationData = getClosestStation(
      maybeStationsData as StationsInfo,
      maybeLocation as LocationData,
    );

    if ((maybeClosestStationData as Error).code)
      return setError(maybeClosestStationData as Error);

    setError(null);
    setClosestStation(maybeClosestStationData as StationInfo);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Text style={styles.header} adjustsFontSizeToFit numberOfLines={1}>
          Where is the nearest Bicing Station? 🚲
        </Text>
        <ModeSelector onChangeMode={key => setMode(key)} />
        <Text style={styles.text}>
          {closestStation
            ? `The closest station is ${
                closestStation.name
              }, which is ${closestStation.distance ||
                '-'}m away, and has available ${
                closestStation.numBikesAvailable
              } bike(s) out of ${closestStation.capacity}`
            : !error && 'Loading'}
        </Text>
        {error && <ErrorMessage error={error} />}
        <OpenMapsButton
          location={location}
          closestStation={closestStation}
          mode={mode}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundBody,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  text: {
    paddingBottom: SpaceLarge,
  },
  header: {
    fontSize: 20,
    color: HighlightedTextColor,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    paddingBottom: SpaceXLarge,
  },
});

export default registerRootComponent(App);
