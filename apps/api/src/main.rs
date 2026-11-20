mod errors;
mod db;
mod auth;
mod models;
mod routes;

use axum::{Router, extract::State, http::StatusCode, routing::get};
use sqlx::{PgPool, postgres::PgPoolOptions};
use std::time::Duration;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "info".into()),
        )
        .init();

        let database_url =
            std::env::var("DATABASE_URL").expect("DATABASE_URL not defined in .env");

        // Aqui o pool vai manter 5 conexoes abertas e reaproveitar as requests ao em vez de abrir/fechar conexao por request
        let pool = PgPoolOptions::new()
            .max_connections(5)
            .acquire_timeout(Duration::from_secs(3)) // desiste ao esperar mais de 3s por uma conexao
            .connect(&database_url)
            .await
            .expect("Failed to connect to PostgreSQL");
        tracing::info!("Connected on PostgreSQL");

        let app = Router::new()
            .route("/health", get(health))
            .merge(routes::rotas())
            .with_state(pool);

        let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
            .await
            .expect("Unable to open port 3000");
        
        tracing::info!("Server running on http://localhost:3000");
        axum::serve(listener, app)
            .await
            .expect("Server error");
}

async fn health(State(pool): State<PgPool>) -> (StatusCode, &'static str)
{
    match sqlx::query("SELECT 1").execute(&pool).await {
        Ok(_) => (StatusCode::OK, "ok"),
        Err(erro) => {
            tracing::error!("Health check failed: {erro}");
            (StatusCode::SERVICE_UNAVAILABLE, "banco indisponivel") // 503
        }
    }
}