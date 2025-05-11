import {Stack} from "expo-router";
import {AppProvider} from "@/app/context/AppProvider";
import {useFonts} from "expo-font";

export default function RootLayout() {
    const [loaded] = useFonts({
        Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
        InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    })

    if (!loaded){
        return null;
    }else{
        return (
            <AppProvider>
                <Stack>
                    <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                </Stack>
            </AppProvider>
        )
    }
}
