import { View, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView, Animated, Pressable } from "react-native";
import { Text } from "@/components/ui/Form";
import { AppButton } from "@/components/ui/AppButton";
import { useState, useRef, useEffect } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from 'expo-secure-store';

export default function Page() {
    // Form fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    // Animation values for field focus effects
    const firstNameAnim = useRef(new Animated.Value(0)).current;
    const lastNameAnim = useRef(new Animated.Value(0)).current;
    const emailAnim = useRef(new Animated.Value(0)).current;
    const passwordAnim = useRef(new Animated.Value(0)).current;
    const confirmPasswordAnim = useRef(new Animated.Value(0)).current;

    // Password strength calculation
    const calculatePasswordStrength = (pwd) => {
        if (!pwd) return 0;
        
        let strength = 0;
        // Length check
        if (pwd.length >= 8) strength += 1;
        // Uppercase check
        if (/[A-Z]/.test(pwd)) strength += 1;
        // Lowercase check
        if (/[a-z]/.test(pwd)) strength += 1;
        // Number check
        if (/[0-9]/.test(pwd)) strength += 1;
        // Special character check
        if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
        
        return strength;
    };

    const passwordStrength = calculatePasswordStrength(password);
    
    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 1) return "#FF3B30"; // Weak - Red
        if (passwordStrength <= 3) return "#FF9500"; // Medium - Orange
        return "#30D158"; // Strong - Green
    };

    // Animation helper function
    const animateField = (animValue, toValue) => {
        Animated.timing(animValue, {
            toValue,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    // Form validation
    function validateForm() {
        if (!firstName || !lastName) {
            Alert.alert("Please enter your full name");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Please enter a valid email");
            return false;
        }

        if (password.length < 8) {
            Alert.alert("Password must be at least 8 characters long");
            return false;
        }

        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match");
            return false;
        }

        return true;
    }

    function handleSignUp() {
        if (!validateForm()) return;

        fetch("/api/sign-up", {
            method: "POST",
            body: JSON.stringify({ firstName, lastName, email, password }),
        }).then(async (response) => {
            if (response.ok) {
                const data = await response.json();
                // Replace localStorage with SecureStore
                try {
                    await SecureStore.setItemAsync("token", data.token);
                    router.push("/dashboard");
                    Alert.alert("Success", "Sign up successful!");
                } catch (error) {
                    console.error("Error saving token:", error);
                    Alert.alert("Error", "Could not save authentication token.");
                }
            } else {
                Alert.alert("Error", "Sign up failed. Please try again.");
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
                        <Text style={styles.title}>Create Account</Text>
                        
                        {/* First Name Field */}
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>First Name</Text>
                            <Animated.View style={[
                                styles.inputContainer,
                                { borderColor: firstNameAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.8)']
                                })}
                            ]}>
                                <TextInput
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    style={styles.input}
                                    placeholder="John"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    onFocus={() => animateField(firstNameAnim, 1)}
                                    onBlur={() => animateField(firstNameAnim, 0)}
                                    autoCapitalize="words"
                                />
                            </Animated.View>
                        </View>
                        
                        {/* Last Name Field */}
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Last Name</Text>
                            <Animated.View style={[
                                styles.inputContainer,
                                { borderColor: lastNameAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.8)']
                                })}
                            ]}>
                                <TextInput
                                    value={lastName}
                                    onChangeText={setLastName}
                                    style={styles.input}
                                    placeholder="Doe"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    onFocus={() => animateField(lastNameAnim, 1)}
                                    onBlur={() => animateField(lastNameAnim, 0)}
                                    autoCapitalize="words"
                                />
                            </Animated.View>
                        </View>
                        
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
                                    placeholder="john.doe@example.com"
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
                                    placeholder="Min. 8 characters"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    secureTextEntry={true}
                                    onFocus={() => animateField(passwordAnim, 1)}
                                    onBlur={() => animateField(passwordAnim, 0)}
                                    autoCapitalize="none"
                                />
                            </Animated.View>
                            
                            {/* Password strength indicator */}
                            {password.length > 0 && (
                                <View style={styles.strengthContainer}>
                                    <View style={styles.strengthMeterContainer}>
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <View 
                                                key={level}
                                                style={[
                                                    styles.strengthSegment,
                                                    { 
                                                        backgroundColor: passwordStrength >= level 
                                                            ? getPasswordStrengthColor() 
                                                            : 'rgba(255,255,255,0.2)' 
                                                    }
                                                ]}
                                            />
                                        ))}
                                    </View>
                                    <Text style={[styles.strengthText, { color: getPasswordStrengthColor() }]}>
                                        {passwordStrength <= 1 ? "Weak" : passwordStrength <= 3 ? "Medium" : "Strong"}
                                    </Text>
                                </View>
                            )}
                        </View>
                        
                        {/* Confirm Password Field */}
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <Animated.View style={[
                                styles.inputContainer,
                                { borderColor: confirmPasswordAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.8)']
                                })}
                            ]}>
                                <TextInput
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    style={styles.input}
                                    placeholder="Confirm password"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    secureTextEntry={true}
                                    onFocus={() => animateField(confirmPasswordAnim, 1)}
                                    onBlur={() => animateField(confirmPasswordAnim, 0)}
                                    autoCapitalize="none"
                                />
                            </Animated.View>
                            {confirmPassword.length > 0 && (
                                <Text style={[styles.matchText, { 
                                    color: password === confirmPassword ? "#30D158" : "#FF3B30" 
                                }]}>
                                    {password === confirmPassword ? "Passwords match" : "Passwords do not match"}
                                </Text>
                            )}
                        </View>
                        
                        {/* Sign Up Button */}
                        <AppButton 
                            onPress={handleSignUp}
                            style={styles.signUpButton}
                        >
                            Create Account
                        </AppButton>
                        
                        {/* Login Link */}
                        <Pressable onPress={() => router.push("/sign-in")}>
                            <Text style={styles.loginLink}>
                                Already have an account? <Text style={styles.loginLinkBold}>Sign In</Text>
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
    signUpButton: {
        backgroundColor: "#FF375F", // iOS pinkish color
        width: "100%",
        padding: 16,
        borderRadius: 12,
        marginTop: 12,
    },
    strengthContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        gap: 10,
    },
    strengthMeterContainer: {
        flexDirection: "row",
        gap: 4,
        flex: 1,
    },
    strengthSegment: {
        height: 4,
        flex: 1,
        borderRadius: 2,
    },
    strengthText: {
        fontSize: 14,
        fontWeight: "600",
    },
    matchText: {
        fontSize: 14,
        marginTop: 8,
        marginLeft: 4,
    },
    loginLink: {
        color: "rgba(255,255,255,0.8)",
        textAlign: "center",
        marginTop: 20,
        fontSize: 15,
    },
    loginLinkBold: {
        fontWeight: "bold",
        color: "white",
    },
});