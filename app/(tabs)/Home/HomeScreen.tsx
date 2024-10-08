import {useState} from "react";
import {StyleSheet, Text, View, Button} from "react-native";
import {Link} from "expo-router";
import {useAuth} from "@/app/context/auth";
import ChildComponent from "@/app/(tabs)/Home/SubComponents/ChildComponent";

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

    let [isVisible,setIsVisible] = useState(true);

    function changeVisibility() {
        setIsVisible(!isVisible);
    }

    return (
        // your home screen content here
        <View style={[styles.center]}>
            <FamilyMember name="Denys" color="red"/>
            <FamilyMember name="Roman" color="green"/>
            <FamilyMember name="Denys" color="blue"/>
            <FamilyMember name="Test" color="pink"/>
            <Link href="/(other)/Settings" asChild>
                <Button title="Settings" />
            </Link>

            <Button
                title="Logout"
                onPress={() => {
                onLogout().then((result) => {
                    console.log(result.data.value);
                }).catch((error) => {
                    console.log(error)
                })
            }}/>

            <Button title="SwitchComponent" onPress={()=> changeVisibility() }/>
            <View style= {{display: isVisible ? 'flex' : 'none'}}>
                <ChildComponent/>
            </View>



        </View>
);
}
