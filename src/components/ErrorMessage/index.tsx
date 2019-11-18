import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Error } from '../../constants/errors';
import { AntDesign } from '@expo/vector-icons';
import {
  SpaceXSmall,
  SpaceSmall,
  SpaceMedium,
  SpaceBig,
  AlertTextColor,
  AlertBackgroundBody,
} from '../../constants/designTokens';

type Props = {
  error: Error;
};
const ErrorMessage = ({ error }: Props) => {
  const { message } = error;

  const displayedMessage = message ?? 'Unknown Error';

  return (
    <View style={styles.container}>
      <AntDesign
        style={styles.icon}
        name='warning'
        size={24}
        color={AlertTextColor}
      />
      <Text
        accessible={true}
        accessibilityRole='text'
        accessibilityLabel='Error Message'
        accessibilityHint={displayedMessage}
        style={styles.text}>
        {displayedMessage}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: SpaceSmall,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AlertBackgroundBody,
    marginBottom: SpaceBig,
  },
  icon: {
    paddingEnd: SpaceMedium,
    paddingStart: SpaceXSmall,
  },
  text: {
    color: AlertTextColor,
    fontWeight: 'bold',
  },
});

export default ErrorMessage;
