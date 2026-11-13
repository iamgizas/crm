export type TipoPessoa = 'PF' | 'PJ'

export interface Cliente {
    id: string
    tipo: TipoPessoa
    nome: string
    documento: string
    email?: string 
    telefone?: string
    observacoes?: string
    criado_em: string
    atualizado_em: string 
}

export interface Endereco {
    id: string
    client_id: string
    cep?: string
    logradouro?: string
    numero?: string
    complemento?: string
    bairro?: string
    cidade?: string
    estado?: string
    principal: boolean
    criado_em: string
}

export type NovoCliente = Omit<Cliente, 'id' | 'criado_em' | 'atualizado_em'>
export type NovoEndereco = Omit<Endereco, 'id' | 'criado_em'>