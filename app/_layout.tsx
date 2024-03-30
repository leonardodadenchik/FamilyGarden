import {Stack} from "expo-router"
import {AuthProvider} from "@/app/context/auth";

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack>
                <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="(other)" options={{headerShown: false}}/>
            </Stack>
        </AuthProvider>
    )
}
