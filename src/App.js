import "./App.css";

import {Redirect, Route, Switch} from "react-router-dom";

import TorcedorLista from "./pages/torcedores-lista";
import FormularioTorcedor from "./pages/formulario-torcedor";
import Login from "./pages/login";
import React from "react";
import {usuarioEstaLogado} from "./services/autenticacao-service";
import MainImage from './assets/images/logo.png';

class App extends React.Component {
    render() {
        return (<div className="App">
                <header className="App-header"><div className="App-logo-cooper"><img src={MainImage}/></div>Cadastro de Torcedores</header>
                <Switch>
                <Route exact path={["/", "/login"]} component={Login}/>{" "}
                <Route exact path={["/torcedores"]}
                       render={() => usuarioEstaLogado() ? < TorcedorLista/> : <Redirect to={"/"}/>}/>{" "}
                <Route exact path={["/novo", "/editar"]}
                       render={() => usuarioEstaLogado() ? (<FormularioTorcedor/>) : (<Redirect to={"/"}/>)}/>{" "}
            </Switch>{" "}
            </div>
        );
    }
}

export default App;