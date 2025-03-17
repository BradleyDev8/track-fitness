import { View, Text, StyleSheet, Pressable, StyleProp, ViewStyle } from "react-native";
import { router } from "expo-router";

export function AppButton({children, onPress, style}: {
    children: React.ReactNode,
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
}) {
    return(
        <Pressable style={[styles.button, style]} onPress={onPress}>
            <Text style={styles.buttonText}>{children}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#3AAED8",
        padding: 12,
        borderRadius: 8,
        width: 120,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
    },
})