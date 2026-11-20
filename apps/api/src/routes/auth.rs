use axum::{Json, extract::State, http::StatusCode};
use sqlx::PgPool;

use crate::{
    auth::senha,
    db,
    errors::{AppError, AppResult},
    models::usuario::{RegistroRequest, UsuarioResponse},
};

// POST /auth/registro
// Se o JSON vier quebrado ou faltando campo obrigatorio, o Axum ja recusa sozinho
pub async fn registro(
    State(pool): State<PgPool>,
    Json(dados): Json<RegistroRequest>,
) -> AppResult<(StatusCode, Json<UsuarioResponse>)> {
    let nome = dados.nome.trim();
    let email = dados.email.trim().to_lowercase();

    if nome.is_empty() {
        return Err(AppError::BadRequest("Nome é obrigatório".into()));
    }

    if !email.contains('@') {
        return Err(AppError::BadRequest("E-mail invalido".into()));
    }

    if dados.senha.chars().count() < 8 {
        return Err(AppError::BadRequest(
            "A senha precisa ter pelo menos 8 caracteres".into(),
        ));
    }

    // --- hash ---
    let senha_hash = senha::gerar_hash(&dados.senha)?;

    let usuario = db::usuarios::criar(&pool, nome, &email, &senha_hash, dados.data_nascimento)
        .await
        .map_err(|erro| {
            if let sqlx::Error::Database(erro_db) =&erro {
                if erro_db.is_unique_violation() {
                    return AppError::Conflict("E-mail já cadastrado".into());
                }
            }

            AppError::from(erro)
        })?;

    Ok((StatusCode::CREATED, Json(usuario)))
}