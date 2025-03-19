import { View, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView, Animated, Pressable } from "react-native";
import { Text } from "@/components/ui/Form";
import { AppButton } from "@/components/ui/AppButton";
import { useState, useRef } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { secureSave } from "@/utils/storage";

export default function Page() {
    // Form fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // Animation values for field focus effects
    const emailAnim = useRef(new Animated.Value(0)).current;
    const passwordAnim = useRef(new Animated.Value(0)).current;

    // Animation helper function
    const animateField = (animValue: Animated.Value, toValue: number) => {
        Animated.timing(animValue, {
            toValue,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    // Form validation
    function validateForm() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Please enter a valid email");
            return false;
        }

        if (!password) {
            Alert.alert("Please enter your password");
            return false;
        }

        return true;
    }

    function handleSignIn() {
        if (!validateForm()) return;

        fetch("/api/sign-in", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }).then(async (response) => {
            if (response.ok) {
                const data = await response.json();
                try {
                    await secureSave("token", data.token);
                    router.push("/dashboard/home");
                    Alert.alert("Success", "Sign in successful!");
                } catch (error) {
                    console.error("Error saving token:", error);
                    Alert.alert("Error", "Could not save authentication token.");
                }
            } else {
                Alert.alert("Error", "Invalid email or password");
            }
        }).catch(error => {
            Alert.alert("Error", "An unexpected error occurred. Please try again.");
            console.error(error);
        });
    }

    return (
        <LinearGradient
            colors={["#000000", "#3D0A2F"]}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoid}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Welcome Back</Text>
                        
                        {/* Email Field */}
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Email Address</Text>
                            <Animated.View style={[
                                styles.inputContainer,
                                { borderColor: emailAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.8)']
                                })}
                            ]}>
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    style={styles.input}
                                    placeholder="your.email@example.com"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    onFocus={() => animateField(emailAnim, 1)}
                                    onBlur={() => animateField(emailAnim, 0)}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    autoComplete="email"
                                />
                            </Animated.View>
                        </View>
                        
                        {/* Password Field */}
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Password</Text>
                            <Animated.View style={[
                                styles.inputContainer,
                                { borderColor: passwordAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.8)']
                                })}
                            ]}>
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    secureTextEntry={true}
                                    onFocus={() => animateField(passwordAnim, 1)}
                                    onBlur={() => animateField(passwordAnim, 0)}
                                    autoCapitalize="none"
                                />
                            </Animated.View>
                        </View>
                        
                        {/* Sign In Button */}
                        <AppButton 
                            onPress={handleSignIn}
                            style={styles.signInButton}
                        >
                            Sign In
                        </AppButton>
                        
                        {/* Sign Up Link */}
                        <Pressable onPress={() => router.push("/sign-up")}>
                            <Text style={styles.signUpLink}>
                                Don't have an account? <Text style={styles.signUpLinkBold}>Sign Up</Text>
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        paddingVertical: 40,
    },
    formContainer: {
        width: "88%",
        alignSelf: "center",
        gap: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "white",
        marginBottom: 20,
        textAlign: "center",
    },
    fieldContainer: {
        width: "100%",
        gap: 8,
    },
    label: {
        fontSize: 16,
        color: "white",
        fontWeight: "600",
        marginLeft: 4,
    },
    inputContainer: {
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.1)",
        overflow: "hidden",
    },
    input: {
        padding: 16,
        fontSize: 16,
        color: "white",
        width: "100%",
    },
    signInButton: {
        backgroundColor: "#FF375F", // iOS pinkish color
        width: "100%",
        padding: 16,
        borderRadius: 12,
        marginTop: 12,
    },
    signUpLink: {
        color: "rgba(255,255,255,0.8)",
        textAlign: "center",
        marginTop: 20,
        fontSize: 15,
    },
    signUpLinkBold: {
        fontWeight: "bold",
        color: "white",
    },
});