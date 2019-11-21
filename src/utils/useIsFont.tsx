import * as React from 'react';
import { loadAsync } from 'expo-font';

const useIsFont = (): boolean => {
  const [isFontLoaded, setFontLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    (async (): Promise<void> => {
      await loadAsync({
        'inter-regular': require('../../assets/fonts/Inter-Regular.ttf'),
        'inter-semi-bold': require('../../assets/fonts/Inter-SemiBold.ttf'),
        'inter-bold': require('../../assets/fonts/Inter-Bold.ttf'),
      });
      setFontLoaded(true);
    })();
  }, [isFontLoaded]);

  return isFontLoaded;
};

export default useIsFont;
