import {useState} from 'react';
import {Button, Text, View} from 'react-native';
import {Link} from "expo-router";
import {useUserContext} from "@/app/context/user";

export default function ToDoScreen() {

	const {appData, createFamily, getFamily, leaveFamily, updateUser, addToFamily} = useUserContext();

	const [count, setCount] = useState(0);

	return (
		<View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>

			<Text>You clicked {count} times</Text>

			<Button onPress={() => setCount(count + 1)} title="Click me!"/>
			<Link href="/(other)/Settings" asChild>
				<Button title="Settings"/>
			</Link>

			<Button title="createFamily" onPress={async () => {
				const {data, error} = await createFamily("GardenFamily", "SuperMegaFamily");
				if (data) {
					console.log(data.data);
				}else {
					console.log(error);
				}
			}}/>

			<Button title="getFamily" onPress={async () => {
				const {data, error} = await getFamily();
				if (data) {
					console.log(data.data.value);
				}else {
					console.log(error);
				}
			}}/>

			<Button title="addToFamily" onPress={async () => {
				const {data, error} = await addToFamily(3);
				if (data) {
					console.log(data.data);
				}else {
					console.log(error);
				}
			}}/>

			<Button title="leaveFamily" onPress={async () => {
				const {data, error} = await leaveFamily();
				if (data) {
					console.log(data.data);
				}else {
					console.log(error);
				}
			}}/>

			<Button title="updateUser" onPress={async () => {
				const {data, error} = await updateUser(1,1,1,"MishaProkopenko","Misha","Prokopenko","dima@user.user", "1CCA4B");
				if (data) {
					console.log(data.data);
				}else {
					console.log(error);
				}
			}}/>

			<Text>{JSON.stringify(appData, null, 2)}</Text>
		</View>
	);

}
