import {Text, View, StyleSheet} from "react-native";
import {Link} from "expo-router";
import {useAuth} from "@/app/context/auth";

    const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"

    }
});

type GreetingProps = {
    name: string,
    color: string
};

const FamilyMember = (props: GreetingProps) => {
    return (
        <View>
            <Text style={{color: props.color}}> Hello {props.name} </Text>
        </View>
    );
};

export default function HomeScreen() {
    const {onLogout} = useAuth()

    return (
        // your home screen content here
        <View style={[styles.center]}>
            <FamilyMember name="Denys" color="red"/>
            <FamilyMember name="Roman" color="green"/>
            <FamilyMember name="Denys" color="blue"/>
            <FamilyMember name="Test" color="pink"/>
            <Link href="/(other)/Settings">Settings</Link>

            <Text onPress={()=> {
                onLogout().then((result) => {
                    console.log(result.data.value);
                }).catch((error) => {console.log(error)})
            }}>Logout{"\n"}</Text>
        </View>
    );
}
