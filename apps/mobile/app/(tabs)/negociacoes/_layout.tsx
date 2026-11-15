import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { Colors } from '../../../constants/Colors'

export default function NegociacoesLayout() {
  const scheme = useColorScheme() ?? 'dark'
  const cores  = Colors[scheme]

  return (
    <Stack
      screenOptions={{
        headerStyle:    { backgroundColor: cores.background },
        headerTintColor: cores.text,
        contentStyle:   { backgroundColor: cores.background },
      }}
    >
      {/* index.tsx — sem cabeçalho, mostra o título da tab bar */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* nova.tsx — com cabeçalho "Nova negociação" */}
      <Stack.Screen name="nova"  options={{ title: 'Nova negociação' }} />
    </Stack>
  )
}
