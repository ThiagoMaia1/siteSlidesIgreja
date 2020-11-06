import React, { Component } from 'react';
import './App.css';
import Arrastar from './Components/Arrastar/Arrastar';
import Preview from './Components/Preview/Preview';
import Galeria from './Components/Preview/Galeria/Galeria'
import { store } from './index';
import { Provider } from 'react-redux';
import Configurar from './Components/Configurar/Configurar.jsx';
import MenuExportacao from './Components/MenuExportacao/MenuExportacao';
import PopupAdicionar from './Components/PopupAdicionar/PopupAdicionar';
import Login from './Components/Login/Login';

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {loginAtivo: true}
  }

  toggleLogin = () => {
    this.setState({loginAtivo: !this.state.loginAtivo})
  }

  render() {
    return (
      <Provider store={store}>
        <Login fundo={true} ativo={this.state.loginAtivo} callback={this.toggleLogin}/>
        <PopupAdicionar/>
        <div className="App">
          <div id='organizador'>
            <Arrastar />
            <Preview />
            <Configurar />
          </div>
          <Galeria id='galeria'/>
          <MenuExportacao />
        </div>
      </Provider>
    );
  }
}

export default App;
