use axum::{Router, routing::post};
use sqlx::PgPool;

pub mod auth;

pub fn rotas() -> Router<PgPool> {
    Router::new().route("/auth/registro", post(auth::registro))
}