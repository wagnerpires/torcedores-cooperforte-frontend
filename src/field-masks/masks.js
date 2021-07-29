const maskCpf = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

const maskPhone = (value, tipo) => {
  return tipo === "CELULAR" ? mascaraCelular(value) : mascaraTelefone(value);
};

const mascaraCelular = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(\d{4})-(\d)(\d{4})/, "$1$2-$3")
    .replace(/(-\d{4})\d+?$/, "$1");
};

const mascaraTelefone = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{3})(\d)/, "$1-$2")
    .replace(/(\d{3})-(\d)(\d{3})/, "$1$2-$3")
    .replace(/(-\d{4})\d+?$/, "$1");
};

const maskCep = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1-$2");
};

const maskJustNumbers = (value) => value.replace(/\D/g, "");

const maskJustLetters = (value) => value.replace(/[0-9]/g, "");

export { maskCpf, maskPhone, maskJustNumbers, maskCep, maskJustLetters };
