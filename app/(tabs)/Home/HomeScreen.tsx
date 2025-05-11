import {useState} from "react";
import {StyleSheet} from "react-native";
import {Text, View, Button} from 'tamagui';
import {Link} from "expo-router";
import {useAuthContext} from "@/app/context/Auth";
import ChildComponent from "@/app/(tabs)/Home/SubComponents/ChildComponent";
import ParentComponent from "@/app/(tabs)/Home/SubComponents/ParentComponent";

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
	const {logout} = useAuthContext()

	const [userType, setUserType] = useState('parent');

	return (
		// your home screen content here
		<View style={[styles.center]}>
			<FamilyMember name="Denys" color="red"/>
			<FamilyMember name="Roman" color="green"/>
			<FamilyMember name="Denys" color="blue"/>
			<FamilyMember name="Test" color="pink"/>
			<Link href="/(other)/Settings" asChild>
				<Button>Settings</Button>
			</Link>
			<Button onPress={async () => {
				const {data, error} = await logout()
				if (data) {
					console.log(data.data.value);
				} else {
					console.log(error)
				}
			}}
			>Logout</Button>

			<View>
				{userType === 'parent' ? <ParentComponent/> : <ChildComponent/>}
				<Button onPress={() => setUserType('parent')}>Switch to Parent</Button>
				<Button onPress={() => setUserType('child')}>Switch to Child</Button>
			</View>


		</View>
	);
}
