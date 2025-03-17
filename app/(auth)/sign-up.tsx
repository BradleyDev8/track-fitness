import { View, StyleSheet, TextInput, Alert } from "react-native";
import { Text } from "@/components/ui/Form";
import { AppButton } from "@/components/ui/AppButton";
import { useState } from "react";
import { router } from "expo-router";

export default function Page(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSignUp(){
        if (!email || !password){
            Alert.alert("Please enter email and password");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
            Alert.alert("Please enter a valid email");
            return;
        }

        if (password.length < 8){
            Alert.alert("Password must be at least 8 characters long");
            return;
        }

        fetch("/api/sign-up", {
            method: "POST",
            body: JSON.stringify({email, password}),
        }).then(async(response) => {
            if (response.ok){
                const data = await response.json()
                localStorage.setItem("token", data.token);
                router.push("/dashboard");
                alert("Sign Up successful");
                console.log(data);
            } else {
                alert("Sign Up failed");
            }
        })
        
    }
    return(
        <View style={styles.container}>
            <View style={styles.form}>
                <View style={styles.field}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="Email" autoCapitalize="none" />
            </View>

            <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
                <TextInput value={password} onChangeText={setPassword} style={styles.input} placeholder="Password" secureTextEntry={true} autoCapitalize="none" />
            </View>
            <AppButton onPress={handleSignUp}>
                Sign Up
            </AppButton>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0A1128",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
    },
    input: {
        backgroundColor: "white",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        textAlign: "left",
        width: "80%",
    },
    field: {
        width: "80%",
        gap: 12,
    },
    form: {
        gap: 24,
        width: "80%",
    }
})