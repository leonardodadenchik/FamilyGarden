import {TamaguiProvider, createTamagui, Theme} from 'tamagui';
import {config} from '@tamagui/config';

const tamaguiConfig = createTamagui(config);

type Conf = typeof tamaguiConfig

declare module '@tamagui/core' {
	interface TamaguiCustomConfig extends Conf {}
}

const StyleProvider = ({children}: any) => {
	return <TamaguiProvider config={tamaguiConfig}>{children}</TamaguiProvider>;
}
export {StyleProvider}