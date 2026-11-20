use chrono::NaiveDate;
use sqlx::PgPool;

use crate::models::usuario::UsuarioResponse;

pub async fn criar(
    pool: &PgPool,
    nome: &str,
    email: &str,
    senha_hash: &str,
    data_nascimento: Option<NaiveDate>,
) -> Result<UsuarioResponse, sqlx::Error> {
    
    sqlx::query_as!(
        UsuarioResponse,
        r#"
        INSERT INTO usuarios (nome, email, senha_hash, data_nascimento)
        VALUES ($1, $2, $3, $4)
        RETURNING id, nome, email, data_nascimento, criado_em
        "#,
        nome,
        email,
        senha_hash,
        data_nascimento
    )
    .fetch_one(pool) // Aguarda 1 linha de volta (RETURNING)
    .await
}