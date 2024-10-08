import {Button, Text, View} from "react-native";
import {Link} from "expo-router";

export default function MarketScreen() {
    return (
        // your settings screen content here
        <View>
            <Text>Market</Text>
            <Link href="/(other)/Settings" asChild>
                <Button title="Settings" />
            </Link>
        </View>

    );
}
