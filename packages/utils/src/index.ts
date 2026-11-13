export function validarCPF(cpf: string): boolean {
  // Remove tudo que não é número
  const numeros = cpf.replace(/\D/g, "");

  if (numeros.length !== 11) return false;
  if (/^(\d)\1+$/.test(numeros)) return false; // ex 111.111.111-11

  // valida digitos verificadores
  const calcDigito = (base: string, peso: number) => {
    const soma = base
      .split("")
      .reduce((acc, n, i) => acc + Number(n) * (peso - i), 0);
    const resto = (soma * 10) % 11;
    return resto >= 10 ? 0 : resto;
  };

  const d1 = calcDigito(numeros.slice(0, 9), 10);
  const d2 = calcDigito(numeros.slice(0, 10), 11);

  return d1 === Number(numeros[9]) && d2 === Number(numeros[10]);
}

export function validarCNPJ(cnpj: string): boolean {
  const numeros = cnpj.replace(/\D/g, "");

  if (numeros.length !== 14) return false;
  if (/^(\d)\1+$/.test(numeros)) return false; // ex: 11.111.111/1111-11

  const calcDigito = (base: string, pesos: number[]) => {
    const soma = base
      .split("")
      .reduce((acc, n, i) => acc + Number(n) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const p1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const p2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const d1 = calcDigito(numeros.slice(0, 12), p1);
  const d2 = calcDigito(numeros.slice(0, 13), p2);

  return d1 === Number(numeros[12]) && d2 === Number(numeros[13]);
}

// --- FORMATAÇÃO ---

export function formatarCPF(cpf: string): string {
  const n = cpf.replace(/\D/g, "");
  return n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function formatarCNPJ(cnpj: string): string {
  const n = cnpj.replace(/\D/g, "");
  return n.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

// --- DOCUMENTO GENÉRICO ---

export function validarDocumento(documento: string): boolean {
  const numeros = documento.replace(/\D/g, "");
  if (numeros.length === 11) return validarCPF(numeros);
  if (numeros.length === 14) return validarCNPJ(numeros);
  return false;
}
