import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity, View, StyleSheet, useColorScheme } from 'react-native'
import { router } from 'expo-router'
import { Colors } from '../constants/Colors'

// Tipo mínimo que a gente precisa do state — evita conflito entre versões do React Navigation
type TabState = {
  index: number
  routes: { key: string; name: string }[]
}

const ICONES: Record<string, { ativo: string; inativo: string }> = {
  'dashboard':          { ativo: 'grid',      inativo: 'grid-outline'      },
  'negociacoes':        { ativo: 'briefcase', inativo: 'briefcase-outline' },
  'clientes/index':     { ativo: 'people',    inativo: 'people-outline'    },
  'configuracoes':      { ativo: 'settings',  inativo: 'settings-outline'  },
}

const ROTAS: Record<string, string> = {
  'dashboard':          '/(tabs)/dashboard',
  'negociacoes':        '/(tabs)/negociacoes',
  'clientes/index':     '/(tabs)/clientes/',
  'configuracoes':      '/(tabs)/configuracoes',
}

export function CustomTabBar({ state }: { state: TabState }) {
  const scheme = useColorScheme() ?? 'dark'
  const cores = Colors[scheme]

  return (
    <View style={styles.wrapper}>
      <BlurView
        intensity={70}
        tint={scheme === 'dark' ? 'dark' : 'light'}
        style={styles.container}
      >
        {state.routes.map((route: TabState['routes'][number], index: number) => {
          const ativo = state.index === index
          const icone = ICONES[route.name]

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              onPress={() => {
                if (!ativo) {
                  router.navigate(ROTAS[route.name] as any)
                }
              }}
            >
              <Ionicons
                name={(ativo ? icone?.ativo : icone?.inativo) as any}
                size={22}
                color={ativo ? cores.tabIconActive : cores.tabIcon}
              />
            </TouchableOpacity>
          )
        })}
      </BlurView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position:  'absolute',
    bottom:    30,
    left:      60,
    right:     60,
  },
  container: {
    flexDirection:   'row',
    borderRadius:    30,
    overflow:        'hidden',
    height:          52,
    paddingHorizontal: 8,
  },
  tab: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
  },
})
