import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StationInfo } from '../../services/fetchStationsData';
import {
  DefaultTextColor,
  SpaceMedium,
  SpaceLarge,
} from '../../constants/designTokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Loader from './Loader';
type Props = {
  isLoading: boolean;
  closestStation: StationInfo;
};

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

  const parseDistance = (distance: number): string => {
    if (!distance) return '- m';

    if (distance > 1000) {
      return `${Math.round((distance / 1000) * 10) / 10} km`;
    }

    return `${distance} m`;
  };

  return (
    <View
      accessible={true}
      accessibilityLabel='Nearest Station Info Card'
      style={styles.container}>
      <View style={styles.leftPanel}>
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
      <View>
        <Text style={[styles.text, styles.textName]}>{`${closestStation?.name ??
          '-'}`}</Text>
      </View>
      <View>
        <Text style={styles.text}>
          {parseDistance(Number(closestStation?.distance))}
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
    alignItems: 'center',
    padding: SpaceMedium,
    marginBottom: SpaceLarge,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    borderColor: DefaultTextColor,
  },
  leftPanel: {
    flexDirection: 'column',
  },
  bikeIcon: {
    paddingStart: 7,
  },
  textName: {
    fontSize: 14,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DefaultTextColor,
  },
});

export default NearestStationCard;
