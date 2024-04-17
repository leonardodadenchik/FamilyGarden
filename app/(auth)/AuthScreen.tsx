import {Text, Button, View} from "react-native";
import {useAuth} from "@/app/context/auth";

export default function AuthScreen() {
    const {authState, onRegister, onLogin, onLogout} = useAuth();

    return (
        <View>
            <Button title={"Register"} onClick={()=> {
                onRegister("dima@user.user", "password", "Misha", "Prokopenko", 1, 1, "pixel", "2024-03-27").then((result) => {
                    console.log(result.data);
                }).catch((error) => {console.log(error)})
            }}
            />

            <Button title={"Login"} onPress={()=> {
                onLogin("admin@admin.admin", "admin1", "pixel").then((result) => {
                    console.log(result.data.value);
                }).catch((error) => {console.log(error)})
            }}
            />

            <Button title={"Logout"} onPress={()=> {
                onLogout().then((result) => {
                    console.log(result.data.value);
                }).catch((error) => {console.log(error)})
            }}
            />

            <Text>{authState.token}{"\n"}</Text>
            <Text>{authState.refreshToken}{"\n"}</Text>
            <Text>{authState.authenticated?.toString()}{"\n"}</Text>
        </View>
    );
}
