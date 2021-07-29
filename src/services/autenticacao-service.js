const axios = require("axios");
axios.defaults.headers.post["Content-Type"] = "application/json";
const JWTHelper = require("jwthelper");

const autenticacao = axios.create({
  baseURL: process.env.REACT_APP_SERVICO_URL,
});

const autenticar = (payload) => {
  return autenticacao.post(`/auth/authenticate`, payload);
};

const deslogar = () => {
  localStorage.clear();
};

const obterUsuarioLogado = () => {
  const helper = JWTHelper.createJWTHelper();
  return helper.decode(localStorage.getItem("token"));
 };

const usuarioLogadoIsAdministrador = () => {
  const usuarioLogado = obterUsuarioLogado();
  return (
    usuarioLogado && usuarioLogado.perfil && usuarioLogado.perfil === "ADMIN"
  );
};

const usuarioEstaLogado = () => {
  const usuario = obterUsuarioLogado();

  if (usuario && usuario.exp) {
    const date = new Date(0);
    date.setUTCSeconds(usuario.exp);
    return date.valueOf() > new Date().valueOf();
  }

  return false;
};

export {
  autenticar,
  deslogar,
  usuarioLogadoIsAdministrador,
  usuarioEstaLogado,
};
