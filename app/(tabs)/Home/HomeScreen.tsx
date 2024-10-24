import {useState} from "react";
import {StyleSheet, Text, View, Button} from "react-native";
import {Link} from "expo-router";
import {useAuthContext} from "@/app/context/auth";
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
	const {onLogout} = useAuthContext()

	const [userType, setUserType] = useState('parent');

	return (
		// your home screen content here
		<View style={[styles.center]}>
			<FamilyMember name="Denys" color="red"/>
			<FamilyMember name="Roman" color="green"/>
			<FamilyMember name="Denys" color="blue"/>
			<FamilyMember name="Test" color="pink"/>
			<Link href="/(other)/Settings" asChild>
				<Button title="Settings"/>
			</Link>

			<Button title="Logout" onPress={async () => {
				const {data, error} = await onLogout()
				if (data) {
					console.log(data.data.value);
				} else {
					console.log(error)
				}
			}}
			/>

			<View>
				{userType === 'parent' ? <ParentComponent/> : <ChildComponent/>}
				<Button title="Switch to Parent" onPress={() => setUserType('parent')}/>
				<Button title="Switch to Child" onPress={() => setUserType('child')}/>
			</View>


		</View>
	);
}
