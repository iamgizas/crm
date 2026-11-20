use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde_json::json;

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("{0}")]
    BadRequest(String), // 400 - dado invalido

    #[error("Não autorizado")]
    Unauthorized, // 401 - sem token, token invalido, senha errada

    #[error("{0}")]
    NotFound(String), // 404 - Registro nao existe

    #[error("{0}")]
    Conflict(String), // 409 - ja existe

    #[error("{0}")]
    Internal(String), // 500 - falha interna

    #[error("Erro no banco de dados")]
    Database(#[from] sqlx::Error),
}

pub type AppResult<T> = Result<T, AppError>;
impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, mensagem) = match &self {
            AppError::BadRequest(msg) => (StatusCode::BAD_REQUEST, msg.clone()),
            AppError::Unauthorized => (StatusCode::UNAUTHORIZED, self.to_string()),
            AppError::NotFound(msg) => (StatusCode::NOT_FOUND, msg.clone()),
            AppError::Conflict(msg) => (StatusCode::CONFLICT, msg.clone()),

            AppError::Database(sqlx::Error::RowNotFound) => {
                (StatusCode::NOT_FOUND, "Registro não encontrado".to_string())
            }

            AppError::Database(sqlx::Error::Database(erro_db)) if erro_db.is_unique_violation() => {
                (StatusCode::CONFLICT, "Registro já existe".to_string())
            }

            AppError::Internal(detalhe) => {
                tracing::error!("Erro interno: {detalhe}");
                (StatusCode::INTERNAL_SERVER_ERROR, "Erro interno do servidor".to_string())
            }

            AppError::Database(sqlx::Error::Database(erro_db))
                if erro_db.is_foreign_key_violation() =>
            {
                (StatusCode::BAD_REQUEST, "Referência inválida".to_string())
            }

            AppError::Database(sqlx::Error::Database(erro_db)) if erro_db.is_check_violation() => {
                (StatusCode::BAD_REQUEST, "Dados inválidos".to_string())
            }

            AppError::Database(erro) => {
                tracing::error!("Erro no banco: {erro:?}");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Erro interno do servidor".to_string(),
                )
            }
        };

        (status, Json(json!({ "erro": mensagem }))).into_response()
    }
}