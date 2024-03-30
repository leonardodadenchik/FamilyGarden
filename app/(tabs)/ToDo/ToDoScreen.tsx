import {useState} from 'react';
import {Button, Text, View} from 'react-native';

export default function ToDoScreen() {

    const [count, setCount] = useState(0);

    return (

        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>

            <Text>You clicked {count} times</Text>

            <Button onPress={() => setCount(count + 1)} title="Click me!"/>


        </View>

    );

}
