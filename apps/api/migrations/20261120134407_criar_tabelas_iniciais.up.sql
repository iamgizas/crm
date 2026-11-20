CREATE TYPE tipo_pessoa AS ENUM('PF', 'PJ');
CREATE TYPE status_negociacao AS ENUM('em_negociacao', 'ganho', 'perdido', 'vencido');

CREATE FUNCTION set_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE usuarios (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    nome            text        NOT NULL,
    email           text        NOT NULL UNIQUE,
    senha_hash      text        NOT NULL,
    data_nascimento date,
    criado_em       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE clientes (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo            tipo_pessoa NOT NULL,
    nome            text        NOT NULL,
    documento       text        NOT NULL UNIQUE, -- CPF/CNPJ somente numeros
    email           text,
    telefone        text,
    observacoes     text,
    criado_em       timestamptz NOT NULL DEFAULT now(),
    atualizado_em   timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT documento_formato CHECK (
        (tipo = 'PF' AND documento ~ '^\d{11}$') OR
        (tipo = 'PJ' AND documento ~ '^\d{14}$')
    )
);

CREATE TRIGGER clientes_atualizado_em
    BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE TABLE enderecos(
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id  uuid        NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    cep         text        NOT NULL,
    logradouro  text        NOT NULL,
    numero      text,
    complemento text,
    bairro      text,
    cidade      text        NOT NULL,
    estado      text        NOT NULL,
    principal   boolean     NOT NULL DEFAULT false,
    criado_em   timestamptz NOT NULL DEFAULT now()       
);

CREATE INDEX enderecos_cliente_id_idx ON enderecos (cliente_id);

CREATE UNIQUE INDEX enderecos_um_principal_por_cliente
    ON enderecos (cliente_id) WHERE principal;

CREATE TABLE negociacoes(
   id               uuid                PRIMARY KEY DEFAULT gen_random_uuid(),
   cliente_id       uuid                NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
   titulo           text                NOT NULL,
   valor            numeric(15, 2)      NOT NULL DEFAULT 0 CHECK (valor >= 0),
   status           status_negociacao   NOT NULL DEFAULT 'em_negociacao',
   data_fechamento  date,
   criado_em        timestamptz         NOT NULL DEFAULT now(),
   atualizado_em    timestamptz         NOT NULL DEFAULT now()
);

CREATE INDEX negociacoes_cliente_id_idx ON negociacoes (cliente_id);
CREATE INDEX negociacoes_status_idx     ON negociacoes (status); -- o dashboard vai agrupar por status

CREATE TRIGGER negociacoes_atualizado_em
    BEFORE UPDATE ON negociacoes
    FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();