import { createClient } from '@supabase/supabase-js'
import type { Cliente, Endereco, NovoCliente, NovoEndereco } from '@crm/types'

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