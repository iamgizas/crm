use argon2::{
    Argon2, PasswordHasher,
    password_hash::{SaltString, rand_core::OsRng},
};

use crate::errors::AppError;

pub fn gerar_hash(senha: &str) -> Result<String, AppError> {
    let salt = SaltString::generate(&mut OsRng);

    Argon2::default()
        .hash_password(senha.as_bytes(), &salt)
        .map(|hash| hash.to_string())
        .map_err(|erro| AppError::Internal(format!("Falha ao gerar hash: {erro}")))
}