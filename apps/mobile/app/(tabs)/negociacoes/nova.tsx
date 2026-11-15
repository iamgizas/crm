import { useState, useEffect } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, useColorScheme, ActivityIndicator, Alert,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { listarClientes, criarNegociacao } from '@crm/supabase'
import { Colors } from '../../../constants/Colors'
import { supabase } from '../../../src/lib/supabase'
import type { Cliente, StatusNegociacao } from '@crm/types'

const STATUS_OPCOES: { valor: StatusNegociacao; label: string; cor: string }[] = [
  { valor: 'em_negociacao', label: 'Em negociação', cor: '#7c3aed' },
  { valor: 'ganho',         label: 'Ganho',         cor: '#10b981' },
  { valor: 'perdido',       label: 'Perdido',        cor: '#ef4444' },
  { valor: 'vencido',       label: 'Vencido',        cor: '#f59e0b' },
]

export default function NovaNegociacaoScreen() {
  const scheme = useColorScheme() ?? 'dark'
  const cores  = Colors[scheme]

  const [clientes, setClientes]           = useState<Cliente[]>([])
  const [clienteSelecionado, setCliente]  = useState<Cliente | null>(null)
  const [titulo, setTitulo]               = useState('')
  const [valor, setValor]                 = useState('')
  const [status, setStatus]               = useState<StatusNegociacao>('em_negociacao')
  const [salvando, setSalvando]           = useState(false)
  const [mostrarClientes, setMostrarClientes] = useState(false)

  useEffect(() => {
    listarClientes(supabase).then(setClientes)
  }, [])

  async function salvar() {
    if (!clienteSelecionado) { Alert.alert('Selecione um cliente'); return }
    if (!titulo.trim())      { Alert.alert('Informe o título');     return }

    setSalvando(true)
    try {
      await criarNegociacao(supabase, {
        cliente_id: clienteSelecionado.id,
        titulo:     titulo.trim(),
        valor:      parseFloat(valor.replace(',', '.')) || 0,
        status,
      })
      router.back()
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a negociação.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: cores.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={cores.text} />
        </TouchableOpacity>
        <Text style={[styles.titulo, { color: cores.text }]}>Nova negociação</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Seletor de cliente */}
        <Text style={[styles.label, { color: cores.textMuted }]}>Cliente</Text>
        <TouchableOpacity
          style={[styles.input, { backgroundColor: cores.card, borderColor: cores.border }]}
          onPress={() => setMostrarClientes(!mostrarClientes)}
        >
          <Text style={{ color: clienteSelecionado ? cores.text : cores.textMuted }}>
            {clienteSelecionado?.nome ?? 'Selecionar cliente...'}
          </Text>
          <Ionicons name={mostrarClientes ? 'chevron-up' : 'chevron-down'} size={18} color={cores.textMuted} />
        </TouchableOpacity>

        {/* Lista de clientes (dropdown) */}
        {mostrarClientes && (
          <View style={[styles.dropdown, { backgroundColor: cores.card, borderColor: cores.border }]}>
            {clientes.map(c => (
              <TouchableOpacity
                key={c.id}
                style={styles.dropdownItem}
                onPress={() => { setCliente(c); setMostrarClientes(false) }}
              >
                <Text style={{ color: cores.text }}>{c.nome}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Título */}
        <Text style={[styles.label, { color: cores.textMuted }]}>Título</Text>
        <TextInput
          style={[styles.input, { backgroundColor: cores.card, borderColor: cores.border, color: cores.text }]}
          placeholder="Ex: Contrato anual de serviços"
          placeholderTextColor={cores.textMuted}
          value={titulo}
          onChangeText={setTitulo}
        />

        {/* Valor */}
        <Text style={[styles.label, { color: cores.textMuted }]}>Valor (R$)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: cores.card, borderColor: cores.border, color: cores.text }]}
          placeholder="0,00"
          placeholderTextColor={cores.textMuted}
          value={valor}
          onChangeText={setValor}
          keyboardType="numeric"
        />

        {/* Status */}
        <Text style={[styles.label, { color: cores.textMuted }]}>Status</Text>
        <View style={styles.statusGrid}>
          {STATUS_OPCOES.map(op => (
            <TouchableOpacity
              key={op.valor}
              style={[
                styles.statusBotao,
                { borderColor: op.cor, backgroundColor: status === op.valor ? op.cor : 'transparent' },
              ]}
              onPress={() => setStatus(op.valor)}
            >
              <Text style={{ color: status === op.valor ? '#fff' : op.cor, fontWeight: '600', fontSize: 13 }}>
                {op.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão salvar */}
        <TouchableOpacity
          style={[styles.botao, { backgroundColor: cores.primary }]}
          onPress={salvar}
          disabled={salvando}
        >
          {salvando
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.botaoTexto}>Salvar negociação</Text>
          }
        </TouchableOpacity>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 60 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 28,
  },
  titulo: { fontSize: 20, fontWeight: '700' },
  label:  { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 6, marginTop: 16 },
  input: {
    height: 52, borderRadius: 12, borderWidth: 1,
    paddingHorizontal: 14, fontSize: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  dropdown: {
    borderRadius: 12, borderWidth: 1, marginTop: 4, overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 14, paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ffffff22',
  },
  statusGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
  },
  statusBotao: {
    borderWidth: 1.5, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  botao: {
    height: 52, borderRadius: 12, marginTop: 32,
    alignItems: 'center', justifyContent: 'center',
  },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '700' },
})
