import {Button, Text, View, Theme} from "tamagui";
import {Link} from "expo-router";
import {useThemeContext} from "@/app/context/Theme";

export default function MarketScreen() {
    const {theme, toggleTheme} = useThemeContext();
	const someList = [1,2,3,4,5];
	return (
        // your settings screen content here
        <View>
			{/*@ts-ignore*/}
            <Theme name = {theme}>
            	<Text>Market</Text>
				<Link href="/(other)/Settings" asChild>
					<Button>Settings</Button>
				</Link>
				<Button onPress = {() => toggleTheme()}>SwitchTheme</Button>
				<Text>{theme}</Text>
            </Theme>
			{someList.map((item) => {
				return(
					<Text>{item}</Text>
				);
			})}
        </View>

    );
}
