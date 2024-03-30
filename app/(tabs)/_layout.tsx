import {Tabs} from 'expo-router';

export default function StackLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="Home"
                         options={{headerTitleAlign: 'center'}}/>
            <Tabs.Screen name="ToDo"
                         options={{headerTitleAlign: 'center'}}/>
            <Tabs.Screen name="Market"
                         options={{headerTitleAlign: 'center'}}/>
        </Tabs>
    );
}
