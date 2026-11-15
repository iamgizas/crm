import { useEffect, useState, useCallback } from 'react'
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, useColorScheme, ActivityIndicator,
} from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { listarNegociacoes } from '@crm/supabase'
import { Colors } from '../../../constants/Colors'
import { supabase } from '../../../src/lib/supabase'
import type { Negociacao } from '@crm/types'

// Cores e labels de cada status
const COR_STATUS: Record<string, string> = {
  em_negociacao: '#7c3aed',
  ganho:         '#10b981',
  perdido:       '#ef4444',
  vencido:       '#f59e0b',
}

const LABEL_STATUS: Record<string, string> = {
  em_negociacao: 'Em negociação',
  ganho:         'Ganho',
  perdido:       'Perdido',
  vencido:       'Vencido',
}

type NegociacaoComCliente = Negociacao & { clientes: { nome: string } }

export default function NegociacoesScreen() {
  const scheme = useColorScheme() ?? 'dark'
  const cores  = Colors[scheme]

  const [negociacoes, setNegociacoes] = useState<NegociacaoComCliente[]>([])
  const [loading, setLoading]         = useState(true)

  // Recarrega a lista toda vez que a tela entra em foco (ex: após criar uma nova)
  useFocusEffect(
    useCallback(() => {
      setLoading(true)
      listarNegociacoes(supabase)
        .then(data => setNegociacoes(data as NegociacaoComCliente[]))
        .catch(err => console.error('Erro ao carregar negociações:', err))
        .finally(() => setLoading(false))
    }, [])
  )

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: cores.background }]}>
        <ActivityIndicator color={cores.primary} size="large" />
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: cores.background }]}>
      <Text style={[styles.titulo, { color: cores.text }]}>Negociações</Text>

      <FlatList
        data={negociacoes}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={
          <Text style={[styles.vazio, { color: cores.textMuted }]}>
            Nenhuma negociação ainda.{'\n'}Toca no + para criar.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: cores.card }]}>
            {/* Badge de status */}
            <View style={[styles.badge, { backgroundColor: COR_STATUS[item.status] + '22' }]}>
              <Text style={[styles.badgeTexto, { color: COR_STATUS[item.status] }]}>
                {LABEL_STATUS[item.status]}
              </Text>
            </View>

            <Text style={[styles.cardTitulo, { color: cores.text }]}>{item.titulo}</Text>
            <Text style={[styles.cardCliente, { color: cores.textMuted }]}>
              {item.clientes?.nome}
            </Text>
            <Text style={[styles.cardValor, { color: cores.primary }]}>
              {Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>
          </View>
        )}
      />

      {/* Botão + flutuante */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: cores.primary }]}
        onPress={() => router.push('/(tabs)/negociacoes/nova')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 60 },
  titulo:    { fontSize: 28, fontWeight: '800', marginBottom: 20 },
  vazio:     { textAlign: 'center', marginTop: 60, fontSize: 15, lineHeight: 24 },
  card: {
    borderRadius: 14, padding: 16, marginBottom: 12,
  },
  badge: {
    alignSelf: 'flex-start', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 3, marginBottom: 8,
  },
  badgeTexto:  { fontSize: 11, fontWeight: '700' },
  cardTitulo:  { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  cardCliente: { fontSize: 13, marginBottom: 6 },
  cardValor:   { fontSize: 18, fontWeight: '800' },
  fab: {
    position: 'absolute', bottom: 100, right: 24,
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.3,
    shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
})
