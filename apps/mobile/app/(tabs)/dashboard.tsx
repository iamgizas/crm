import { useEffect, useState } from 'react'
import {
  View, Text, ScrollView, StyleSheet,
  useColorScheme, Dimensions, ActivityIndicator,
} from 'react-native'
import { PieChart } from 'react-native-chart-kit'
import { Colors } from '../../constants/Colors'
import { supabase } from '../../src/lib/supabase'
import { resumoDashboard } from '@crm/supabase'

const { width } = Dimensions.get('window')

const COR_STATUS = {
  em_negociacao: '#7c3aed',
  ganho:         '#10b981',
  perdido:       '#ef4444',
  vencido:       '#f59e0b',
}

const LABEL_STATUS: Record<string, string> = {
  em_negociacao: 'Em negociação',
  ganho:         'Ganhos',
  perdido:       'Perdidos',
  vencido:       'Vencidos',
}

type Resumo = Awaited<ReturnType<typeof resumoDashboard>>

export default function DashboardScreen() {
  const scheme = useColorScheme() ?? 'dark'
  const cores  = Colors[scheme]

  const [resumo, setResumo]   = useState<Resumo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    resumoDashboard(supabase)
      .then(setResumo)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: cores.background }]}>
        <ActivityIndicator color={cores.primary} size="large" />
      </View>
    )
  }

  // Monta os dados do gráfico de pizza
  const dadosPizza = Object.entries(resumo?.porStatus ?? {})
    .filter(([, v]) => v.count > 0)
    .map(([status, v]) => ({
      name:       LABEL_STATUS[status],
      population: v.count,
      color:      COR_STATUS[status as keyof typeof COR_STATUS],
      legendFontColor: cores.text,
      legendFontSize:  12,
    }))

  const totalNegociacoes = Object.values(resumo?.porStatus ?? {})
    .reduce((acc, v) => acc + v.count, 0)

  const valorGanho = resumo?.porStatus.ganho.valor ?? 0

  return (
    <ScrollView
      style={{ backgroundColor: cores.background }}
      contentContainerStyle={styles.container}
    >
      {/* Título */}
      <Text style={[styles.titulo, { color: cores.text }]}>Dashboard</Text>

      {/* Cards de resumo */}
      <View style={styles.cards}>
        <Card
          titulo="Clientes"
          valor={String(resumo?.totalClientes ?? 0)}
          cor={cores.primary}
          corTexto={cores.text}
          corCard={cores.card}
        />
        <Card
          titulo="Negociações"
          valor={String(totalNegociacoes)}
          cor="#7c3aed"
          corTexto={cores.text}
          corCard={cores.card}
        />
        <Card
          titulo="Ganhos R$"
          valor={valorGanho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          cor="#10b981"
          corTexto={cores.text}
          corCard={cores.card}
        />
      </View>

      {/* Gráfico de pizza */}
      {dadosPizza.length > 0 ? (
        <View style={[styles.graficoContainer, { backgroundColor: cores.card }]}>
          <Text style={[styles.secaoTitulo, { color: cores.text }]}>
            Negociações por status
          </Text>
          <PieChart
            data={dadosPizza}
            width={width - 48}
            height={180}
            chartConfig={{
              color: () => cores.primary,
              backgroundColor: cores.card,
              backgroundGradientFrom: cores.card,
              backgroundGradientTo: cores.card,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
            absolute
          />
        </View>
      ) : (
        <View style={[styles.graficoContainer, { backgroundColor: cores.card }]}>
          <Text style={[styles.secaoTitulo, { color: cores.text }]}>
            Negociações por status
          </Text>
          <Text style={[styles.vazio, { color: cores.textMuted }]}>
            Nenhuma negociação cadastrada ainda
          </Text>
        </View>
      )}

      {/* Detalhe por status */}
      <View style={[styles.detalheContainer, { backgroundColor: cores.card }]}>
        <Text style={[styles.secaoTitulo, { color: cores.text }]}>Detalhe</Text>
        {Object.entries(resumo?.porStatus ?? {}).map(([status, v]) => (
          <View key={status} style={styles.detalheRow}>
            <View style={[styles.dot, { backgroundColor: COR_STATUS[status as keyof typeof COR_STATUS] }]} />
            <Text style={[styles.detalheLabel, { color: cores.text }]}>
              {LABEL_STATUS[status]}
            </Text>
            <Text style={[styles.detalheValor, { color: cores.textMuted }]}>
              {v.count} · {v.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>
          </View>
        ))}
      </View>

      {/* Espaço para a tab bar flutuante */}
      <View style={{ height: 100 }} />
    </ScrollView>
  )
}

// Componente interno de card de métrica
function Card({ titulo, valor, cor, corTexto, corCard }: {
  titulo: string; valor: string; cor: string; corTexto: string; corCard: string
}) {
  return (
    <View style={[styles.card, { backgroundColor: corCard, borderLeftColor: cor }]}>
      <Text style={[styles.cardTitulo, { color: corTexto, opacity: 0.6 }]}>{titulo}</Text>
      <Text style={[styles.cardValor, { color: corTexto }]}>{valor}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 24, paddingTop: 60 },
  titulo:    { fontSize: 28, fontWeight: '800', marginBottom: 20 },
  cards:     { gap: 12, marginBottom: 16 },
  card: {
    padding: 16, borderRadius: 12,
    borderLeftWidth: 4,
  },
  cardTitulo: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
  cardValor:  { fontSize: 22, fontWeight: '800' },
  graficoContainer: { borderRadius: 16, padding: 16, marginBottom: 16 },
  detalheContainer: { borderRadius: 16, padding: 16 },
  secaoTitulo: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
  vazio:       { textAlign: 'center', paddingVertical: 24, fontSize: 14 },
  detalheRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  dot:         { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  detalheLabel: { flex: 1, fontSize: 14 },
  detalheValor: { fontSize: 13 },
})
