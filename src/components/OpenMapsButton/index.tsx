import * as React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import getDirections from 'react-native-google-maps-directions';
import { LocationData } from 'expo-location';
import { StationInfo } from '../../services/fetchStationsData';
import { Modes } from '../ModeSelector';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  DefaultTextColor,
  DisabledTextColor,
  BackgroundBody,
  SpaceXSmall,
  SpaceSmall,
} from '../../constants/designTokens';

interface Props {
  closestStation: StationInfo;
  location: LocationData;
  mode: Modes;
}

const OpenMapsButton = ({ closestStation, location, mode }: Props) => {
  const disabled = !(closestStation && location);

  const openInMaps = () => {
    const directionData = {
      source: {
        latitude: location?.coords?.latitude,
        longitude: location?.coords?.longitude,
      },
      destination: {
        latitude: closestStation?.latitude,
        longitude: closestStation?.longitude,
      },
      params: [
        {
          key: 'travelmode',
          value: mode === 'RENT' ? 'walking' : 'bicycling',
        },
      ],
    };
    getDirections(directionData);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.button, disabled && styles.disabled]}
      onPress={openInMaps}
      accessible={true}
      accessibilityRole='button'
      accessibilityLabel='Open in Maps'>
      <MaterialCommunityIcons
        style={[styles.icon, disabled && styles.disabled]}
        name='map-search-outline'
        size={26}
      />
      <Text style={[styles.text, disabled && styles.disabled]}>
        Open in Maps
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BackgroundBody,
    paddingHorizontal: SpaceSmall,
    paddingVertical: SpaceXSmall,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: DefaultTextColor,
  },
  text: {
    fontFamily: 'inter-semi-bold',
    color: DefaultTextColor,
  },
  icon: {
    color: DefaultTextColor,
    paddingRight: SpaceSmall,
  },
  disabled: {
    color: DisabledTextColor,
    borderColor: DisabledTextColor,
  },
});

export default OpenMapsButton;
