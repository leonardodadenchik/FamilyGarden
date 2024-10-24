import {Stack} from "expo-router"
import {AuthProvider} from "@/app/context/auth";
import {UserProvider} from "@/app/context/user";

export default function RootLayout() {
    return (
        <AuthProvider>
            <UserProvider>
                <Stack>
                    <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                </Stack>
            </UserProvider>
        </AuthProvider>
    )
}
