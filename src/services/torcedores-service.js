const axios = require("axios");
axios.defaults.headers.post["Content-Type"] = "application/json";

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVICO_URL,
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const criar = (torcedor) => {
  return api.post(`/torcedores`, torcedor);
};

const atualizar = (torcedor) => {
  return api.put(`/torcedores/${torcedor.id}`, torcedor);
};

const deletar = (id) => {
  return api.delete(`torcedores/${id}`);
};
const listar = () => {
  //Workaround

  if (
    api.defaults &&
    api.defaults.headers.Authorization &&
    api.defaults.headers.Authorization.includes(null)
  ) {
    api.defaults.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return api.get(`/torcedores`);
};

export { listar, criar, atualizar, deletar };
