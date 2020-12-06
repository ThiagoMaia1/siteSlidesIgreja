import React from 'react';
import { connect } from 'react-redux';
import './Login.css';
import { firebaseAuth, googleAuth } from "../../firebase";
import { gerarDocumentoUsuario } from '../../firestore/apiFirestore';
import { checarLogin } from './ModulosLogin';
import SelectCargo from './SelectCargo';
import QuadroNavbar from '../NavBar/QuadroNavbar';
import { store } from '../../index';

function getMensagemErro(error) {
    var codigo = error.code.replace('auth/', '');
    switch (codigo) {
        case 'user-not-found':
            return 'Usuário não cadastrado.';
        case 'wrong-password':
            return 'Senha incorreta.';
        case 'user-disabled':
            return 'Usuário desabilitado.';
        case 'invalid-email':
            return 'Endereço de e-mail inválido.';
        case 'email-already-in-use':
            return 'Já existe uma conta cadastrada para esse e-mail.';
        case 'operation-not-allowed':
            return 'Operação não autorizada.';
        case 'weak-password':
            return 'Defina uma senha mais forte.';
        default:
            return '';
    }
}

class Login extends React.Component {

    constructor (props) {
        super(props);
        this.refUsername = React.createRef();
        this.state = {email: '', senha: '', erro: '', nomeCompleto: '', logando: true, cadastrando: false}
    }

    entrar = event => {
        event.preventDefault();
        this.setState({erro: ''});
        if (this.state.cadastrando && this.state.logando) { 
            this.criarUsuarioComEmailSenha();
        } else if(!this.state.logando) { 
            gerarDocumentoUsuario(this.props.usuario, {nomeCompleto: this.state.nomeCompleto, cargo: this.state.cargo});
        } else {
            firebaseAuth.signInWithEmailAndPassword(this.state.email, this.state.senha).catch(error => {
                this.setState({erro: getMensagemErro(error)});
                console.error(error);
            });
        }
    };

    criarUsuarioComEmailSenha = async () => {
        try{
            const { user } = await firebaseAuth.createUserWithEmailAndPassword(this.state.email, this.state.senha);
            gerarDocumentoUsuario(user, {nomeCompleto: this.state.nomeCompleto, cargo: this.state.cargo});
        }
        catch(error){
            this.setState({erro: getMensagemErro(error)});
        }
    };

    cadastrando = () => {
        this.setState({cadastrando: true});
    }

    removerEventListener = () => {
        if (!this.props.callback) return;
        document.removeEventListener("click", this.clickFora, false);
        this.props.callback();
    }

    callbackLogin = user => {
        if (user.uid && (!user.nomeCompleto || !user.cargo)) {
            this.setState({cadastrando: true, logando: false});
        }
        this.removerEventListener();
        // if(user.uid) this.props.history.push('/app');
    }

    componentDidMount = async () => {
        if (this.refUsername.current) this.refUsername.current.focus();
        if (this.props.callback) document.addEventListener("click", this.clickFora, false);
        checarLogin(this.callbackLogin);
    };

    componentWillUnmount = () => {
        this.removerEventListener();
    }

    logOut = () => {
        firebaseAuth.signOut()
        const tryLoggedOutUser = () => {
            if (store.getState().usuario.uid) {
                timeoutLogout();
            } else {
                this.props.history.push('/login')
            }
        }
        const timeoutLogout = () => setTimeout(() => tryLoggedOutUser(), 100);
        tryLoggedOutUser();
    }

    render() {
        const interiorLogin = (
            <div id='quadro-login'>
                {this.props.usuario.uid
                    ? <>
                        <button className='botao-azul botao' onClick={() => this.props.history.push('/perfil')}>Meu Perfil</button>  
                        <button className='botao limpar-input' onClick={this.logOut}>✕ Sair</button>
                    </>
                    : <>
                        <form className='inputs-login'> 
                            {this.state.logando ?
                                <>
                                    <input ref={this.refUsername} id='username' className='combo-popup' placeholder='E-mail' type='email' value={this.state.email}
                                            onChange={e => this.setState({email: e.target.value})}></input>
                                    <input id='password' className='combo-popup' placeholder='Senha' type='password' value={this.state.senha}
                                            onChange={e => this.setState({senha: e.target.value})}></input>
                                </>
                                : null
                            }   
                            {this.state.cadastrando ?
                                <>
                                    <input id='nome-completo' className='combo-popup' placeholder='Nome Completo' type='text' 
                                        value={this.state.nomeCompleto} onChange={e => this.setState({nomeCompleto: e.target.value})}></input>
                                    <SelectCargo value={this.state.cargo} onChange={e => this.setState({cargo: e.target.value})}/>
                                </> 
                                : null 
                            }
                                <div className='mensagem-erro'>
                                    <div>{this.state.erro}</div>
                                </div>
                                <button className='botao-azul botao' onClick={this.entrar}>Entrar</button>
                        </form>
                        {this.state.cadastrando ? null :
                            <>
                                <hr></hr>
                                <button id='login-google' className='botao limpar-input' 
                                        onClick={() => firebaseAuth.signInWithPopup(googleAuth)}>Entrar com Google</button>
                                <button id='cadastre-se' className='itens' onClick={this.cadastrando}>
                                    Cadastre-se
                                </button>
                                <button id='esqueceu-senha'>Esqueceu sua senha?</button>
                            </>
                        }
                    </>
                }
            </div>
        )
        return (
            <>
                {this.props.callback
                    ? <QuadroNavbar callback={this.removerEventListener} esquerda={true}>
                        {interiorLogin}
                      </QuadroNavbar>
                    : interiorLogin
                }
            </> 
        );
    }
};

const mapState = state => {
  return {usuario: state.usuario, apresentacao: state.present.apresentacao, elementos: state.present.elementos};
}

export default connect(mapState)(Login);
  