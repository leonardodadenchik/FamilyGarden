import {Text, View} from "react-native";
import {useAuth} from "@/app/context/auth";

export default function AuthScreen() {
    const {authState, onRegister, onLogin, onLogout} = useAuth();
    // onLogin("admin@admin.admin", "admin1", "pixel").then((result) => {
    //     console.log(result.data.value);
    // })
    return (
        <View>
            <Text onPress={()=> {
                onRegister("dima@user.user", "password", "Misha", "Prokopenko", 1, 1, "pixel", "2024-03-27").then((result) => {
                    console.log(result.data);
                }).catch((error) => {console.log(error)})
            }}>Register{"\n"}</Text>
            <Text onPress={()=> {
                onLogin("admin@admin.admin", "admin1", "pixel").then((result) => {
                    console.log(result.data.value);
                }).catch((error) => {console.log(error)})
            }}>Login{"\n"}</Text>
            <Text>{authState.token}{"\n"}</Text>
            <Text>{authState.refreshToken}{"\n"}</Text>
            <Text>{authState.authenticated?.toString()}{"\n"}</Text>
        </View>
    );
}
