import { useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";
import { Stack } from "expo-router";

export default function RootLayout() {
  const scheme = useColorScheme() ?? "dark";
  const cores = Colors[scheme];

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: cores.background },
        headerTintColor: cores.text,
        contentStyle: { backgroundColor: cores.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
