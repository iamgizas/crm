import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { Colors } from '../../constants/Colors'

export default function AuthLayout() {
  const scheme = useColorScheme() ?? 'dark'
  const cores  = Colors[scheme]

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: cores.background },
      }}
    />
  )
}
