import { deletar, listar } from "../services/torcedores-service";
import { erro, sucesso } from "./alerts/alertas";
import { maskCep, maskCpf, maskPhone } from "../field-masks/masks";

import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { CardHeader } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { Grid } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "react-router-dom";
import MailIcon from "@material-ui/icons/Mail";
import PhoneIcon from "@material-ui/icons/Phone";
import React from "react";
import Typography from "@material-ui/core/Typography";
import { usuarioLogadoIsAdministrador } from "../services/autenticacao-service";
import { withRouter } from "react-router-dom";

class TorcedorLista extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      torcedores: [],
      usuarioLogadoIsAdministrador: usuarioLogadoIsAdministrador(),
    };
  }

  componentDidMount() {
    listar().then(
      (response) => {
        let { data } = response;
        this.setState({ torcedores: data });
      },
      () => {
        erro("Aviso", "ocorreu um erro ao buscar torcedores");
      }
    );
  }

  excluirTorcedor = (id) => {
    deletar(id)
      .then(() => {
        this.setState({
          torcedores: this.state.torcedores.filter((torcedor) => torcedor.id !== id),
        });
        sucesso("", "Torcedor excluído com sucesso!");
      })
      .catch(() => {
        erro("Aviso", "Ocorreu um erro ao tentar excluir torcedor");
      });
  };

  editarTorcedor = (torcedor) => {
    this.props.history.push({
      pathname: "/editar",
      state: {
        torcedor: torcedor,
      },
    });
  };

  render() {
    const classes = {
      link: {},
    };

    return (
      <React.Fragment>
        <Container fixed>
          <Link to={"/novo"} className={classes.link}>
            <Typography variant="body2">
              {this.state.usuarioLogadoIsAdministrador && (
                <Button variant="contained" color="primary">
                  {this.state.torcedores.length ? "Novo torcedor" : "Incluir torcedor"}
                </Button>
              )}
            </Typography>
          </Link>
          {this.state.torcedores.map((torcedor) => {
            return (
              <Box key={torcedor.id} m={2}>
                <Card>
                  <CardHeader>
                    <IconButton aria-label="delete" className={classes.margin}>
                      <DeleteIcon fontSize="large" />
                    </IconButton>
                  </CardHeader>
                  <CardContent>
                    <Typography color="textSecondary" component="h1" variant="h5">
                      {torcedor.nome}
                    </Typography>
                    <Typography>CPF: {maskCpf(torcedor.cpf)}</Typography>
                    <Typography>
                      {torcedor.logradouro}{" "}{torcedor.complemento}{" "}{torcedor.cidade},{" "}
                      {torcedor.bairro}{" "}{maskCep(torcedor.cep)}
                    </Typography>
                    <Typography></Typography>
                    <Box m={2}>
                      <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                      >
                        <Grid>
                          <Box m={2}>
                            <Badge
                              badgeContent={torcedor.emails.length}
                              color="primary"
                            >
                              <MailIcon />
                            </Badge>

                            {torcedor &&
                            torcedor.emails &&
                            torcedor.emails.map((email) => (
                                <Typography
                                  key={email.id}
                                  color="textSecondary"
                                >
                                  {email.email}
                                </Typography>
                              ))}
                          </Box>
                        </Grid>
                        <Grid>
                          <Box m={2}>
                            <Badge
                              badgeContent={torcedor.telefones.length}
                              color="primary"
                            >
                              <PhoneIcon />
                            </Badge>
                            {torcedor &&
                            torcedor.telefones &&
                            torcedor.telefones.map((telefone) => (
                                <Typography
                                  key={telefone.id}
                                  color="textSecondary">
                                  {maskPhone(telefone.telefone, telefone.tipo)}
                                </Typography>
                              ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                  <CardActions>
                    {this.state.usuarioLogadoIsAdministrador && (
                      <React.Fragment>
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            this.excluirTorcedor(torcedor.id);
                          }}
                          className={classes.margin}
                        >
                          <DeleteIcon fontSize="large" />
                        </IconButton>

                        <IconButton
                          aria-label="Editar"
                          onClick={() => {
                            this.editarTorcedor(torcedor);
                          }}
                          className={classes.margin}
                        >
                          <EditIcon fontSize="large" />
                        </IconButton>
                      </React.Fragment>
                    )}
                  </CardActions>
                </Card>
              </Box>
            );
          })}
        </Container>
      </React.Fragment>
    );
  }
}

export default withRouter(TorcedorLista);
