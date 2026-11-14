import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { Colors } from "../../../constants/Colors";

export default function Clientes() {
  const scheme = useColorScheme() ?? "dark";
  const cores = Colors[scheme];

  return (
    <View style={[styles.container, { backgroundColor: cores.background }]}>
      <Text style={[styles.titulo, { color: cores.text }]}>Clientes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 100 },
  titulo: { fontSize: 24, fontWeight: "bold" },
});
