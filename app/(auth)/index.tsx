import { View, StyleSheet, Button, Pressable, Image } from "react-native";
import { Text } from "@/components/ui/Form";
import { useRouter } from "expo-router";
import { AppButton } from "@/components/ui/AppButton";
export default function Page(){
    const router = useRouter();
    return(
        <View style={styles.container}>
            <Image source={require("@/assets/images/trackfitness.jpeg")} style={styles.logo} />
            <Text style={styles.title}>Lets Get Active</Text>

            <AppButton onPress={() => {
                router.push("/sign-in");
            }}>
                <Text style={styles.buttonText}>Sign In</Text>
            </AppButton>
            <AppButton style={styles.signUpButton} onPress={() => {
                router.push("/sign-up");
            }}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </AppButton>
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
    signUpButton: {
        backgroundColor: "gray",
        padding: 12,
        borderRadius: 8,
        width: 120,
    },
    logo: {
        width: 240,
        height: 200,
        borderRadius: 10,
    }
});