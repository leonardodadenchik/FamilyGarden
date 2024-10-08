import {useState} from 'react';
import {Button, Text, View} from 'react-native';
import {Link} from "expo-router";

export default function ToDoScreen() {

    const [count, setCount] = useState(0);

    return (

        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>

            <Text>You clicked {count} times</Text>

            <Button onPress={() => setCount(count + 1)} title="Click me!"/>
            <Link href="/(other)/Settings" asChild>
                <Button title="Settings" />
            </Link>

        </View>

    );

}
