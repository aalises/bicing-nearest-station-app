import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  RefreshControl,
} from 'react-native';
import { registerRootComponent } from 'expo'; // import it explicitly
import getLocationAsync from './services/location';
import { LocationData } from 'expo-location';
import getDirections from 'react-native-google-maps-directions';
import ModeSelector, { Modes } from './components/ModeSelector';

import fetchStationsData, {
  StationInfo,
  StationsInfo,
} from './services/fetchStationsData';
import getClosestStation from './utils/getClosestStation';
import { Error } from './constants/errors';

const App = () => {
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [closestStation, setClosestStation] = React.useState<StationInfo>(null);
  const [error, setError] = React.useState<Error>(null);
  const [location, setLocation] = React.useState<LocationData>(null);
  const isDirectionButtonEnabled = closestStation && location;
  const [mode, setMode] = React.useState<Modes>('RENT');

  React.useEffect(() => {
    (async (): Promise<void> => await getClosestStationData())();
  }, [mode]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await getClosestStationData();
    setRefreshing(false);
  }, [refreshing]);

  const openInMaps = () => {
    const directionData = {
      source: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      destination: {
        latitude: closestStation.latitude,
        longitude: closestStation.longitude,
      },
      params: [
        {
          key: 'travelmode',
          value: 'walking',
        },
      ],
    };
    getDirections(directionData);
  };

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
        <ModeSelector onChangeMode={key => setMode(key)} />
        <Text>
          {closestStation
            ? `The closest station is ${
                closestStation.name
              }, which is ${closestStation.distance ||
                '-'}m away, and has available ${
                closestStation.numBikesAvailable
              } bike(s) out of ${closestStation.capacity}`
            : !error && 'Loading'}
        </Text>
        {error && <Text>{error.message}</Text>}
        <Button
          disabled={!isDirectionButtonEnabled}
          onPress={openInMaps}
          title='Open in Maps'
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default registerRootComponent(App);
