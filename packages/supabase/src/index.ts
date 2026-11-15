import { createClient } from '@supabase/supabase-js'
import type { Cliente, Endereco, NovoCliente, NovoEndereco, Negociacao, NovaNegociacao } from '@crm/types'

// Re-exporta tipos do supabase-js para os apps não precisarem instalar o pacote diretamente
export type { Session, User } from '@supabase/supabase-js'

//Recebe credenciais como parameters
export function createSupabaseClient(url: string, anonKey: string) {
    return createClient(url, anonKey)
}

type SupabaseClient = ReturnType<typeof createSupabaseClient>

// --- CLIENTES ---

export async function listarClientes(client: SupabaseClient) {
    const { data, error } = await client
        .from('clientes')
        .select('*')
        .order('nome')

    if (error) throw error
    return data as Cliente[]
}

export async function buscarCliente(client: SupabaseClient, id: string) {
    const { data, error } = await client
        .from('clientes')
        .select('*, enderecos(*)') // traz cliente e endereco junto
        .eq('id', id)
        .single()
    
    if (error) throw error
    return data as Cliente & { enderecos: Endereco[] }
}

export async function criarCliente(client: SupabaseClient, cliente: NovoCliente) {
    const { data, error } = await client
        .from('clientes')
        .insert(cliente)
        .select()
        .single()

    if (error) throw error
    return data as Cliente
}

export async function atualizarCliente(client: SupabaseClient, id: string, dados: Partial<NovoCliente>) {
  const { data, error } = await client
    .from('clientes')
    .update(dados)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Cliente
}

export async function deletarCliente(client: SupabaseClient, id: string) {
  const { error } = await client
    .from('clientes')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// --- NEGOCIAÇÕES ---

export async function listarNegociacoes(client: SupabaseClient) {
  const { data, error } = await client
    .from('negociacoes')
    .select('*, clientes(nome)')   // traz o nome do cliente junto
    .order('criado_em', { ascending: false })

  if (error) throw error
  return data as (Negociacao & { clientes: { nome: string } })[]
}

export async function criarNegociacao(client: SupabaseClient, negociacao: NovaNegociacao) {
  const { data, error } = await client
    .from('negociacoes')
    .insert(negociacao)
    .select()
    .single()

  if (error) throw error
  return data as Negociacao
}

export async function atualizarNegociacao(client: SupabaseClient, id: string, dados: Partial<NovaNegociacao>) {
  const { data, error } = await client
    .from('negociacoes')
    .update(dados)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Negociacao
}

export async function deletarNegociacao(client: SupabaseClient, id: string) {
  const { error } = await client
    .from('negociacoes')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Resumo para o dashboard: contagem e soma por status
export async function resumoDashboard(client: SupabaseClient) {
  const [{ count: totalClientes }, { data: negociacoes }] = await Promise.all([
    client.from('clientes').select('*', { count: 'exact', head: true }),
    client.from('negociacoes').select('status, valor'),
  ])

  const neg = negociacoes ?? []

  const porStatus = {
    em_negociacao: { count: 0, valor: 0 },
    ganho:         { count: 0, valor: 0 },
    perdido:       { count: 0, valor: 0 },
    vencido:       { count: 0, valor: 0 },
  } as Record<string, { count: number; valor: number }>

  for (const n of neg) {
    porStatus[n.status].count += 1
    porStatus[n.status].valor += Number(n.valor)
  }

  return { totalClientes: totalClientes ?? 0, porStatus }
}

// --- ENDEREÇOS ---

export async function criarEndereco(client: SupabaseClient, endereco: NovoEndereco) {
  const { data, error } = await client
    .from('enderecos')
    .insert(endereco)
    .select()
    .single()

  if (error) throw error
  return data as Endereco
}