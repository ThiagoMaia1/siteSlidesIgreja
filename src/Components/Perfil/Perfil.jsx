import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { connect } from 'react-redux';
import './Perfil.css';
import ApresentacoesUsuario from './ApresentacoesUsuario';
import ListaEmails from './ListaEmails';
import { BsArrowLeft } from 'react-icons/bs'

export const urlPerfil = '/perfil';

const paginasPerfil = [{nome: 'info-pessoal', nomeInterface: 'Informações Pessoais', componente: ApresentacoesUsuario},
                       {nome: 'apresentacoes', nomeInterface: 'Apresentações', componente: ApresentacoesUsuario},
                       {nome: 'predefinicoes', nomeInterface: 'Predefinições', componente: ApresentacoesUsuario},
                       {nome: 'emails', nomeInterface: 'E-mails', componente: ListaEmails},
                       {nome: 'assinatura', nomeInterface: 'Assinatura', componente: ApresentacoesUsuario}

]

class Perfil extends React.Component {

    render() {
        var u = this.props.usuario;
        return (
            <div id='pagina-perfil'>
                <div id='cabecalho-perfil'>
                    <div className='container-seta-voltar'>
                        <div id='seta-voltar' onClick={() => this.props.callback()}>
                            <BsArrowLeft size={window.innerWidth*0.06}/>
                        </div>
                    </div>
                    <img className='foto-usuario grande' src={u.photoURL || require('./Usuário Padrão.png')} alt='Foto Usuário'></img>
                    {u.nomeCompleto}
                </div>
                <Router>
                    <div id='organizador-perfil'>
                        <div id='barra-lateral-perfil'>
                            <div id='menu-perfil'>
                                {paginasPerfil.map(p => 
                                    <Link key={p.nome} to={urlPerfil + '/' + p.nome}>{p.nomeInterface}</Link>
                                )}
                            </div>
                        </div>
                        <Switch>
                            {paginasPerfil.map(p => {
                                var Pagina = p.componente;
                                return (
                                    <Route path={urlPerfil + '/' + p.nome} >
                                        <div className='pagina-perfil'>
                                            <Pagina callback={this.props.callback}/>
                                        </div>
                                    </Route>
                                );    
                            })}
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
};
  
const mapStateToProps = state => {
    return {usuario: state.usuario};
  }

export default connect(mapStateToProps)(Perfil);
  