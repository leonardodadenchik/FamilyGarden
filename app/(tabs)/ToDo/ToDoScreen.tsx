import {useState} from 'react';
import {Button, Text, View} from 'react-native';
import {Link} from "expo-router";
import {useUserContext} from "@/app/context/User";
import {useTaskContext} from "@/app/context/Task";

export default function ToDoScreen() {

	const {appData, createFamily, getFamily, leaveFamily, updateUser, addToFamily} = useUserContext();

	const {createTask, updateTask} = useTaskContext();

	const [count, setCount] = useState(0);

	return (
		<View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>

			<Text>You clicked {count} times</Text>

			<Button onPress={() => setCount(count + 1)} title="Click me!"/>
			<Link href="/(other)/Settings" asChild>
				<Button title="Settings"/>
			</Link>

			<Button title="createFamily" onPress={async () => {
				const {data, error} = await createFamily({
					newFamilyName: "GardenFamily",
					newFamilyDescription: "SuperMegaFamily"
				});
				if (data) {
					console.log(data.data);
				} else {
					console.log(error);
				}
			}}/>

			<Button title="getFamily" onPress={async () => {
				const {data, error} = await getFamily();
				if (data) {
					console.log(data.data.value);
				} else {
					console.log(error);
				}
			}}/>

			<Button title="addToFamily" onPress={async () => {
				const {data, error} = await addToFamily({userId: 3});
				if (data) {
					console.log(data.data);
				} else {
					console.log(error);
				}
			}}/>

			<Button title="leaveFamily" onPress={async () => {
				const {data, error} = await leaveFamily();
				if (data) {
					console.log(data.data);
				} else {
					console.log(error);
				}
			}}/>

			<Button title="updateUser" onPress={async () => {
				const {
					data,
					error
				} = await updateUser({
					userRoleId: 1,
					userGenderId: 1,
					userStatusId: 1,
					userName: "MishaProkopenko",
					firstName: "Misha",
					lastName: "Prokopenko",
					email: "dima@user.user",
					hexColor: "#1CCA4B"
				});
				if (data) {
					console.log(data.data);
				} else {
					console.log(error);
				}
			}}/>

			<Button title="createTask" onPress={async () => {
				const {
					data,
					error
				} = await createTask({
					childId: 11,
					taskName: "Finish Developing Family Garden",
					goodDescription: "Full completion of garden",
					badDescription: "Failing to complete it in time",
					completeDate: "2024-11-06T15:16:24.577Z",
					subTasks: [
						{
							subTaskTypeId: 1,
							subTaskDescription: "some subtaskDescription",
							penaltyCredits: 12,
							royaltyCredits: 5
						},
						{
							subTaskTypeId: 2,
							subTaskDescription: "some subtaskDescription 2",
							penaltyCredits: 228,
							royaltyCredits: 228
						}
					]
				});
				if (data) {
					console.log(data.data);
				} else {
					console.log(error);
				}
			}}/>

			<Button title="updateTask" onPress={async () => {
				const {data, error} = await updateTask({
					taskId: 2,
					taskName: "Test Task Name",
					goodDescription: "Some Good Description",
					badDescription: "Some Bad Description",
					completeDate: "2024-11-06T15:16:24.577Z",
				});
				if (data) {
					console.log(data.data);
				} else {
					console.log(error);
				}
			}}/>

			<Text>{JSON.stringify(appData, null, 2)}</Text>
		</View>
	);

}
