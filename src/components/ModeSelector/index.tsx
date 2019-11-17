import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
  DefaultTextColor,
  HighlightedTextColor,
  SpaceBig,
  SpaceMedium,
  SpaceSmall,
} from '../../constants/designTokens';

export type Modes = 'RENT' | 'RETURN';

export const modes: Array<{ key: Modes; label: string }> = [
  { key: 'RENT', label: 'Rent a bike' },
  { key: 'RETURN', label: 'Return a bike' },
];

type Props = {
  onChangeMode: (key: Modes) => void;
};
const ModeSelector = ({ onChangeMode }: Props) => {
  const [mode, setMode] = React.useState<Modes>('RENT');

  const handleChangeMode = (key: Modes): void => {
    setMode(key);
    onChangeMode(key);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>I want to:</Text>
      <View style={styles.containerInner}>
        {modes.map(({ label, key }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            key={`ModeSelector_Button_${key}`}
            onPress={() => handleChangeMode(key)}>
            <View style={styles.touchableElement}>
              <Text style={[styles.text, mode === key && styles.highlighted]}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: SpaceBig,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  containerInner: {
    marginLeft: SpaceMedium,
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: HighlightedTextColor,
  },
  text: {
    color: DefaultTextColor,
    fontWeight: 'bold',
  },
  touchableElement: {
    padding: SpaceSmall,
  },
  highlighted: {
    color: HighlightedTextColor,
  },
});

export default ModeSelector;
