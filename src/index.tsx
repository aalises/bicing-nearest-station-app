import React from 'react';
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
import fetchStationsData, {
  StationInfo,
  StationsInfo,
} from './services/fetchStationsData';

import getClosestStation from './utils/getClosestStation';
import { Error } from './utils/constants/errors';

const App = () => {
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [closestStation, setClosestStation] = React.useState<StationInfo>(null);
  const [error, setError] = React.useState<Error>(null);

  React.useEffect(() => {
    (async (): Promise<void> => await getClosestStationData())();
  }, []);

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

    const maybeStationsData = await fetchStationsData();

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
        <Text>
          {closestStation
            ? `The closest station is ${
                closestStation.name
              }, which is ${closestStation.distance ||
                '-'}m away, and has available ${
                closestStation.numBikesAvailable
              } bike(s) out of ${closestStation.capacity}`
            : 'Loading'}
        </Text>
        {error && <Text>{error.message}</Text>}
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
