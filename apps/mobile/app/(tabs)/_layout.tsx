import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'
import { Colors } from '../../constants/Colors'
import { CustomTabBar } from '../../components/CustomTabBar'

export default function TabsLayout() {
  const scheme = useColorScheme() ?? 'dark'
  const cores = Colors[scheme]

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerStyle:    { backgroundColor: cores.background },
        headerTintColor: cores.text,
      }}
    >
      <Tabs.Screen name="dashboard"          options={{ title: 'Dashboard'    }} />
      <Tabs.Screen name="negociacoes"       options={{ title: 'Negociações' }} />
      <Tabs.Screen name="clientes/index"    options={{ title: 'Clientes'    }} />
      <Tabs.Screen name="configuracoes"     options={{ title: 'Config'      }} />
    </Tabs>
  )
}
