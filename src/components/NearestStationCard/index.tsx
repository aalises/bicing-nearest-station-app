import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StationInfo } from '../../services/fetchStationsData';
import parseDistance from '../../utils/parseDistance';
import {
  DefaultTextColor,
  SpaceMedium,
  SpaceLarge,
  SpaceSmall,
  DisabledTextColor,
  SpaceXSmall,
} from '../../constants/designTokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Loader from './Loader';

interface Props {
  isLoading: boolean;
  closestStation: StationInfo;
}

const NearestStationCard = ({ closestStation, isLoading }: Props) => {
  if (isLoading) {
    return (
      <View
        accessible={true}
        accessibilityLabel='Loader'
        style={styles.container}>
        <Loader />
      </View>
    );
  }

  return (
    <View
      accessible={true}
      accessibilityLabel='Nearest Station Info Card'
      style={styles.container}>
      <View style={styles.columnPanel}>
        <MaterialCommunityIcons
          color={DefaultTextColor}
          style={styles.bikeIcon}
          name='bike'
          size={32}
        />
        <Text style={styles.text}>
          {`${closestStation?.numBikesAvailable ??
            '-'}/${closestStation?.capacity ?? '-'}`}
        </Text>
      </View>
      <View style={styles.columnPanel}>
        <Text style={[styles.text, styles.textName]}>{`${closestStation?.name ??
          '-'}`}</Text>
        <Text style={[styles.text, styles.textTypeBike]}>{`⚡ ${closestStation
          ?.numBikesAvailableTypes?.ebike ?? '-'}   ⚙️ ${closestStation
          ?.numBikesAvailableTypes?.mechanical ?? '-'}`}</Text>
      </View>
      <View>
        <Text style={styles.text}>
          {parseDistance(
            closestStation?.distance
              ? Number(closestStation?.distance)
              : undefined,
          )}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignSelf: 'stretch',
    padding: SpaceMedium,
    marginBottom: SpaceLarge,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    borderColor: DefaultTextColor,
  },
  columnPanel: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  bikeIcon: {
    paddingStart: SpaceXSmall,
  },
  textName: {
    fontFamily: 'inter-semi-bold',
    paddingBottom: SpaceSmall,
  },
  text: {
    fontSize: 14,
    fontFamily: 'inter-regular',
    color: DefaultTextColor,
  },
  textTypeBike: {
    fontFamily: 'inter-semi-bold',
    color: DisabledTextColor,
  },
});

export default NearestStationCard;
