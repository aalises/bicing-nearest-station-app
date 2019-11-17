import * as React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

export type Modes = 'RENT' | 'RETURN';

const modes: Array<{ key: Modes; label: string }> = [
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
      <Text>I want to:</Text>
      <View style={styles.containerInner}>
        {modes.map(({ label, key }) => (
          <Button
            onPress={() => handleChangeMode(key)}
            key={`Button_${key}`}
            title={label}
            color={mode === key && '#00007f'}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 16,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  containerInner: {
    marginLeft: 8,
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C8C8C8',
  },
});

export default ModeSelector;
