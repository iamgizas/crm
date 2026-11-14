import { useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import { Stack, useRouter, useSegments } from 'expo-router'
import type { Session } from '@crm/supabase'
import { Colors } from '../constants/Colors'
import { supabase } from '../src/lib/supabase'

export default function RootLayout() {
  const scheme = useColorScheme() ?? 'dark'
  const cores   = Colors[scheme]
  const router   = useRouter()
  const segments = useSegments()

  // null = ainda carregando, Session | undefined = já sabe
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    // Busca a sessão salva no dispositivo
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    // Ouve mudanças de auth (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    // Aguarda carregar antes de redirecionar
    if (session === undefined) return

    const emAuthGroup = segments[0] === '(auth)'

    if (!session && !emAuthGroup) {
      // Sem sessão → vai para login
      router.replace('/(auth)/login')
    } else if (session && emAuthGroup) {
      // Com sessão → vai para o app
      router.replace('/(tabs)/dashboard')
    }
  }, [session, segments])

  return (
    <Stack
      screenOptions={{
        headerStyle:    { backgroundColor: cores.background },
        headerTintColor: cores.text,
        contentStyle:   { backgroundColor: cores.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  )
}
