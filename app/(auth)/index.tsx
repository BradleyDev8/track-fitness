import { View, StyleSheet, Button, Pressable, Image } from "react-native";
import { Text } from "@/components/ui/Form";
import { useRouter } from "expo-router";
export default function Page(){
    const router = useRouter();
    return(
        <View style={styles.container}>
            <Image source={require("@/assets/images/trackfitness.jpeg")} style={styles.logo} />
            <Text style={styles.title}>Lets Get Active</Text>
            <Pressable onPress={() => {
                router.push("/sign-in");
            }} style={styles.signInButton}>
                <Text style={styles.buttonText}>Sign In</Text>
            </Pressable>
            <Pressable onPress={() => {
                router.push("/sign-up");
            }} style={styles.signUpButton}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        backgroundColor: "#0A1128",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
    },
    signInButton: {
        backgroundColor: "#3AAED8",
        padding: 12,
        borderRadius: 8,
        width: 120,
    },
    signUpButton: {
        backgroundColor: "gray",
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
    logo: {
        width: 240,
        height: 200,
        borderRadius: 10,
    }
});