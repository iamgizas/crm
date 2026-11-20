use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Deserialize)]
pub struct RegistroRequest {
    pub nome: String,
    pub email: String,
    pub senha: String,
    pub data_nascimento: Option<NaiveDate>,
}

#[derive(Serialize)]
pub struct UsuarioResponse {
    pub id: Uuid,
    pub nome: String,
    pub email: String,
    pub data_nascimento: Option<NaiveDate>,
    pub criado_em: DateTime<Utc>, 
}