import {Tabs} from 'expo-router';

export default () => {
    return (
        <Tabs>
            <Tabs.Screen name="HomeScreen"/>
            <Tabs.Screen name="TodoScreen"/>
            <Tabs.Screen name="AssignTodoScreen"/>
            <Tabs.Screen name="MarketScreen"/>
        </Tabs>
    );
}
