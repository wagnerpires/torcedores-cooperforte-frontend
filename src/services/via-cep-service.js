const axios = require("axios");
axios.defaults.baseURL = process.env.REACT_APP_VIA_CEP_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";

const obterEnderecoPeloCep = (cep) => {
  return axios.get(`${cep}/json/`);
};

export { obterEnderecoPeloCep };
