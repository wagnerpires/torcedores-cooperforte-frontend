import "./FormTorcedor.css";

import { FieldArray, Formik } from "formik";
import { FormControl, Grid, InputLabel, MenuItem, FormLabel, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import { atualizar, criar } from "../services/torcedores-service";
import { erro, sucesso } from "./alerts/alertas";
import {
  maskCep,
  maskCpf,
  maskJustLetters,
  maskJustNumbers,
  maskPhone,
} from "../field-masks/masks";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import React from "react";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { obterEnderecoPeloCep } from "../services/via-cep-service";
import { validate } from "cpf-check";
import { withRouter } from "react-router-dom";

class FormularioTorcedor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        cpf: "",
        nome: "",
        emails: [],
        telefones: [],
        cep: "",
        logradouro: "",
        bairro: "",
        cidade: "",
        uf: "",
        complemento: "",
        email: "",
        celular: "",
        tipo: "",
      },
    };

    if (
      props &&
      props.location &&
      props.location.state &&
      props.location.state.torcedor
    ) {
      this.state.values = {
        ...this.state.values,
        ...props.location.state.torcedor,
      };
    }
  }

  onSubmit = (dados, { setSubmitting }) => {
    const cpf = maskJustNumbers(dados.cpf);

    const cep = maskJustNumbers(dados.cep);

    const telefones = dados.telefones.map((telefone) => {
      telefone.telefone = maskJustNumbers(telefone.telefone);
      return telefone;
    });

    dados = { ...dados, cpf, telefones, cep };

    if (dados && dados.id) {
      this.atualizarTorcedor(dados);
      return;
    }

    criar(JSON.stringify(dados))
      .then(() => {
        sucesso("", "Torcedor cadastrado com sucesso!");
        this.props.history.push("/torcedores");
      })
      .catch(() => {
        erro("Aviso", "Não foi possível salvar o torcedor, CPF já cadastrado...");
      });
  };

  atualizarTorcedor = (torcedor) => {
    atualizar(torcedor)
      .then((resposta) => {
        sucesso("", "Torcedor atualizado com sucesso!");
        this.props.history.push("/torcedores");
      })
      .catch(() => {
        erro("Aviso", "Erro ao tentar atualizar dados do torcedor");
      });
  };

  atualizarCampoDependentesDoCep = (value, setFieldValue) => {
    let cep = value.target.value.replace(/\D/g, "");

    if (cep.length > 7) {
      obterEnderecoPeloCep(cep).then((res) => {
        if (res) {
          let { complemento, logradouro, localidade, uf, bairro } = res.data;
          setFieldValue("logradouro", logradouro);
          setFieldValue("complemento", complemento);
          setFieldValue("cidade", localidade);
          setFieldValue("uf", uf);
          setFieldValue("bairro", bairro);
        }
      });
    }
    setFieldValue("cep", value.target.value);
  };

  adicionarEmail = (
    values,
    arrayHelpers,
    setFieldValue,
    getFieldProps,
    touched
  ) => {
    const emailCadastrado = values.emails.some(
      (email) => email.email === getFieldProps("email").value
    );

    if (emailCadastrado) {
      erro("Aviso", "email já cadastrado");
      return;
    }

    arrayHelpers.push({
      email: getFieldProps("email").value,
    });

    setFieldValue("email", "");
    touched.email = false;
  };

  adicionarTelefone(
    values,
    arrayHelpers,
    setFieldValue,
    getFieldProps,
    touched
  ) {
    const telefoneCadastrado = values.telefones.some(
      (telefone) =>
        // telefone.telefone === maskJustNumbers(getFieldProps("celular").value)
        telefone.telefone === getFieldProps("celular").value
    );

    const contatoPrincipalCadastrado = values.telefones.some(
        (telefone) =>
            telefone.principal === getFieldProps("principal").value
    );

    if (telefoneCadastrado) {
      erro("Aviso", "Telefone já cadastrado");
      return;
    }

    if (contatoPrincipalCadastrado) {
      erro("Aviso", "Contato principal já cadastrado");
      return;
    }


    arrayHelpers.push({
      telefone: getFieldProps("celular").value,
      tipo: getFieldProps("tipo").value,
      principal: getFieldProps("principal").value,
    });

    setFieldValue("celular", "");
    setFieldValue("tipo", "");
    setFieldValue("principal", "");
    touched.celular = false;
  }

  render() {
    const classes = {
      table: {
        minWidth: 650,
      },
      link: {},
    };

    return (
      <React.Fragment>
        <Container fixed>
          <Formik
            initialValues={this.state.values}
            validateOnMount={true}
            onSubmit={this.onSubmit}
            validate={(values) => {
              const errors = {};

              if (!values.cpf) {
                errors.cpf = "Informe o cpf para continuar";
              } else if (!validate(values.cpf)) {
                errors.cpf = "Cpf informado não é válido";
              }

              if (!values.nome) {
                errors.nome = "Informe o nome para continuar";
              } else if (values.nome.length < 3) {
                errors.nome = "O nome deve conter mais de 3 caracteres";
              } else if (values.nome.length > 100) {
                errors.nome = "O nome deve conter menos de 100 caracteres";
              }

              if (values.emails && !values.emails.length) {
                errors.emails = "No mínimo um email deve ser adicionado";
              }

              if (values.telefones && !values.telefones.length) {
                errors.emails = "No mínimo um telefone deve ser adicionado";
              }

              return errors;
            }}
          >
            {({
              values,
              touched,
              handleSubmit,
              handleChange,
              handleBlur,
              errors,
              setFieldValue,
              getFieldProps,
              isValid,
            }) => (
              <form onSubmit={handleSubmit} id="form1">
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={errors.nome && touched.nome}
                      helperText={errors.nome && touched.nome && errors.nome}
                      label="Nome Completo"
                      type="text"
                      variant="outlined"
                      fullWidth
                      name="nome"
                      value={maskJustLetters(values.nome)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={errors.cpf && touched.cpf}
                      helperText={errors.cpf && touched.cpf && errors.cpf}
                      label="CPF"
                      variant="outlined"
                      fullWidth
                      type="text"
                      name="cpf"
                      value={maskCpf(values.cpf)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Cep"
                      variant="outlined"
                      fullWidth
                      inputProps={{
                        maxLength: 10,
                      }}
                      type="text"
                      name="cep"
                      value={maskCep(values.cep)}
                      onChange={(value) => {
                        this.atualizarCampoDependentesDoCep(
                          value,
                          setFieldValue
                        );
                      }}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Cidade"
                      variant="outlined"
                      fullWidth
                      type="text"
                      name="cidade"
                      value={values.cidade}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Logradouro"
                      variant="outlined"
                      fullWidth
                      type="text"
                      name="logradouro"
                      value={values.logradouro}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="UF"
                      variant="outlined"
                      fullWidth
                      type="text"
                      name="uf"
                      value={values.uf}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Complemento"
                      variant="outlined"
                      fullWidth
                      type="text"
                      name="complemento"
                      value={values.complemento}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Bairro"
                      variant="outlined"
                      fullWidth
                      type="text"
                      name="bairro"
                      value={values.bairro}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="h5">Telefones de Contato</Typography>
                    <FieldArray
                      name="telefones"
                      render={(arrayHelpers) => (
                        <div>
                          <FormControl variant="outlined" fullWidth>
                            <InputLabel id="tipoTelefone">
                              Tipo de telefone
                            </InputLabel>
                            <Select
                              labelId="tipoTelefone"
                              id="tipoTelefone"
                              value={values.tipo}
                              name="tipo"
                              onChange={handleChange}
                              label="Tipo do telefone">
                              <MenuItem value={"RESIDENCIAL"}>Residencial</MenuItem>
                              <MenuItem value={"CELULAR"}>Celular</MenuItem>
                              <MenuItem value={"COMERCIAL"}>Comercial</MenuItem>
                            </Select>
                          </FormControl>

                          <TextField
                            margin="normal"
                            error={errors.celular && touched.celular}
                            helperText={
                              errors.celular &&
                              touched.celular &&
                              errors.celular
                            }
                            label="Nº do telefone"
                            variant="outlined"
                            fullWidth
                            type="text"
                            name="celular"
                            value={maskPhone(values.celular, getFieldProps("tipo").value)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />

                          <div className="botao-is-principal"></div>
                          <FormControl variant="outlined" fullWidth>
                            <InputLabel id="isPrincipal">Contato Principal</InputLabel>
                            <Select
                                labelId="isPrincipal"
                                id="isPrincipal"
                                value={values.principal}
                                name="principal"
                                onChange={handleChange}
                                label="Contato Principal">
                              <MenuItem value={"Sim"}>Sim</MenuItem>
                              <MenuItem value={"Não"}>Não</MenuItem>
                            </Select>
                          </FormControl>

                          <Box m={2}>
                            <Button
                              type="button"
                              disabled={
                                !getFieldProps("celular").value ||
                                !getFieldProps("tipo").value
                              }
                              onClick={() =>
                                this.adicionarTelefone(
                                  values,
                                  arrayHelpers,
                                  setFieldValue,
                                  getFieldProps,
                                  touched
                                )
                              }
                              variant="contained"
                              color="primary"
                            >
                              +
                            </Button>
                          </Box>

                          {values.telefones && values.telefones.length > 0
                            ? values.telefones.map((telefone, index) => (
                                <div key={index}>
                                  {maskPhone(
                                    values.telefones[index].telefone,
                                    values.telefones[index].tipo
                                  )}{" "}
                                  ({values.telefones[index].tipo})
                                   {values.telefones[index].principal === "Sim" ? " Contato Principal " : " "}

                                  <button
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)}>-
                                  </button>
                                </div>
                              ))
                            : null}
                        </div>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h5">Emails</Typography>
                    <FieldArray
                      name="emails"
                      render={(arrayHelpers) => (
                        <div>
                          <TextField
                            error={errors.email && touched.email}
                            helperText={
                              errors.email && touched.email && errors.email
                            }
                            label="Email"
                            variant="outlined"
                            fullWidth
                            type="text"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                           />

                          <Box m={2}>
                            <Button
                              type="button"
                              onClick={() => {
                                this.adicionarEmail(
                                  values,
                                  arrayHelpers,
                                  setFieldValue,
                                  getFieldProps,
                                  touched,
                                  errors
                                );
                              }}
                              variant="contained"
                              color="primary"
                              disabled={
                                (errors && !!errors.email) ||
                                !getFieldProps("email").value ||
                                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                  getFieldProps("email").value
                                )
                              }
                            >
                              +
                            </Button>
                          </Box>
                          {values.emails && values.emails.length > 0
                            ? values.emails.map((email, index) => (
                                <div key={index}>
                                  {values.emails[index].email}
                                  <button
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)}
                                  >
                                    -
                                  </button>
                                </div>
                              ))
                            : null}
                        </div>
                      )}
                    />
                  </Grid>
                </Grid>

                <div className="botao-salvar"></div>
                <Grid container direction="row" justifyContent="space-around" alignItems="center">
                  <Link to={"/torcedores"} className={classes.link}>
                    <Typography variant="body2">
                      <Button  className={classes.submit} margin="normal" variant="contained" color="primary">
                        Cancelar
                      </Button>
                    </Typography>
                  </Link>

                  <Button type="submit" form="form1" variant="contained" color="primary" disabled={!isValid}>
                    Cadastrar
                  </Button>

                  <Link to={"/"} className={classes.link}>
                    <Typography variant="body2">
                      <Button  className={classes.submit} margin="normal" variant="contained" color="primary">
                        Encerrar
                      </Button>
                    </Typography>
                  </Link>

                </Grid>
              </form>
            )}
          </Formik>
        </Container>
      </React.Fragment>
    );
  }
}

export default withRouter(FormularioTorcedor);
