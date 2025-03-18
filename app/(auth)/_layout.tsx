import Stack from "@/components/ui/Stack";

export default function Layout(){
    return <Stack>
        <Stack.Screen name="index" options={{
            headerShown: false,
        }} />
        <Stack.Screen name="sign-in" options={{
            presentation: "card",
            headerTitle: "",
        }} />
        <Stack.Screen name="sign-up" options={{
            presentation: "card",
            headerTitle: "",
        }} />
    </Stack>
}