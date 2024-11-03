import {Text, Button, View} from "react-native";
import {useAuthContext} from "@/app/context/auth";

export default function AuthScreen() {
    const {authState, register, login, logout} = useAuthContext();

    return (
        <View>
            <Button title={"Register"} onPress={async () => {
                const {data, error} = await register("dima@user.user", "password", "Misha", "Prokopenko", 1, 1, "pixel", "2024-03-27")
                if (data){
					console.log(data.data);
				}else {
					console.log(error)
				}
            }}
            />

            <Button title={"Login"} onPress={async () => {
                const {data, error} = await login("dima@user.user", "password", "pixel"); //"admin@admin.admin", "admin1", "pixel"
                if (data) {
                    console.log(data.data.value);
                } else {
                    console.log(error);
                }

            }}
            />

            <Button title={"Logout"} onPress={async () => {
                const {data, error} = await logout()
                if (data) {
                    console.log(data.data.value);
                }else {
                    console.log(error)
                }
            }}
            />

            <Text>{authState.token}{"\n"}</Text>
            <Text>{authState.refreshToken}{"\n"}</Text>
            <Text>{authState.authenticated?.toString()}{"\n"}</Text>
        </View>
    );
}
