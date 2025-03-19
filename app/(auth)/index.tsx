import { View, StyleSheet, Image, Pressable, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/Form";
import { useRouter } from "expo-router";
import { AppButton } from "@/components/ui/AppButton";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function Page() {
    const router = useRouter();
    const { isLoggedIn, isLoading } = useAuth();

    // Move navigation logic to useEffect
    useEffect(() => {
        if (!isLoading && isLoggedIn) {
            router.push("/dashboard/home");
        }
    }, [isLoading, isLoggedIn, router]);

    if (isLoading) {
        return <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    }

    return (
        <LinearGradient
            colors={["#000000", "#3D0A2F"]}
            style={styles.container}
        >
            <View style={styles.content}>
                <Image 
                    source={require("@/assets/images/trackfitness.jpeg")} 
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Let's Get Active</Text>

                <View style={styles.buttonContainer}>
                    <AppButton 
                        onPress={() => router.push("/sign-in")}
                        style={styles.signInButton}
                    >
                        Sign In
                    </AppButton>
                    <AppButton 
                        style={styles.signUpButton} 
                        onPress={() => router.push("/sign-up")}
                    >
                        Create Account
                    </AppButton>

                    {/* Optional: Add a guest mode or learn more link */}
                    <Pressable onPress={() => {}}>
                        <Text style={styles.guestLink}>
                            Continue as Guest
                        </Text>
                    </Pressable>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    logo: {
        width: 240,
        height: 200,
        borderRadius: 10,
        marginTop: 40,
    },
    title: {
        fontSize: 36,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        marginVertical: 30,
    },
    buttonContainer: {
        width: "88%",
        gap: 16,
        marginTop: "auto", // Push buttons to bottom
    },
    signInButton: {
        backgroundColor: "#FF375F", // iOS pinkish color
        width: "100%",
        padding: 16,
        borderRadius: 12,
    },
    signUpButton: {
        backgroundColor: "rgba(255,255,255,0.15)",
        width: "100%",
        padding: 16,
        borderRadius: 12,
    },
    guestLink: {
        color: "rgba(255,255,255,0.8)",
        textAlign: "center",
        marginTop: 20,
        fontSize: 15,
        fontWeight: "600",
    },
});