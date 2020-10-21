import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md'

export const fonteBase = {numero: 0.015*window.screen.width, unidade: 'px', fontFamily: 'Helvetica'};

class Preview extends Component {
    
    constructor(props) {
        super(props);
        var wWidth = window.screen.width;
        var wHeight = window.screen.height;
        this.larguraTela = Math.max(wWidth, wHeight);
        this.alturaTela = Math.min(wWidth, wHeight);
        this.full = {icone: <MdFullscreenExit className='icone-botao' size={140}/>, proporcao: 1, opacidadeBotao: '0%'}
        this.small = {icone: <MdFullscreen className='icone-botao' size={60}/>, proporcao: 0.5, opacidadeBotao: '30%'}
        this.state = {screen: {...this.small}}
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                if (this.props.slidePreview.eMestre) this.offsetSlide(1);
                this.setState({screen: {...this.full}});
            } else {
                this.setState({screen: {...this.small}});
            }
          });
    }

    toggleFullscreen () {        

        if (document.fullscreenElement) {
            document.exitFullscreen()
            .catch(function(error) {
                console.log(error.message);
            });
        } else {
            var element = document.getElementById('preview');

            element.requestFullscreen()
            .catch(function(error) {
                console.log(error.message);
            });
        }
    }

    offsetSlide = offset => this.props.dispatch({type: 'offset-selecao', offset: offset})
    
    tornarBotaoVisivel = () => {
        this.setState({screen: {...this.state.screen, opacidadeBotao: '80%'}})
    }

    tornarBotaoInvisivel = () => {
        if (this.state.screen.proporcao === this.full.proporcao) {
            this.setState({screen: {...this.state.screen, opacidadeBotao: this.full.opacidadeBotao}})
        } else {
            this.setState({screen: {...this.state.screen, opacidadeBotao: this.small.opacidadeBotao}})    
        }
    }

    realcarElemento = aba => {
        return {boxShadow: (this.props.realce.aba === aba && this.state.screen.proporcao === this.small.proporcao ? '0px 0px 9px ' + this.props.realce.cor : ''), 
                borderRadius: '1.5vh', marginTop: '2px'};
    }

    render() {
        

        return (
            <div id='preview' style={{width: this.larguraTela*this.state.screen.proporcao, 
                                      height: this.alturaTela*this.state.screen.proporcao, 
                                      ...this.realcarElemento('tampao')}}>
                <div className='tampao' style={this.props.slidePreview.estilo.tampao}>
                                  
                </div>
                {this.props.marcaDagua}
                <Img imagem={this.props.slidePreview.estilo.fundo} />
                <div className='texto-preview' style={{fontSize: fonteBase.numero*this.state.screen.proporcao + fonteBase.unidade}}>
                    <div className='slide-titulo' style={this.props.slidePreview.estilo.titulo}>
                        <div><span style={this.realcarElemento('titulo')}>{this.props.slidePreview.titulo}</span></div>
                    </div>
                    <div id='paragrafo-slide' className='slide-paragrafo' style={this.props.slidePreview.estilo.paragrafo}>
                        <div style={this.realcarElemento('paragrafo')}>{this.props.slidePreview.texto}</div>
                    </div>
                </div>
                <div className='container-setas'>
                    <div className='movimentar-slide' onClick={() => this.offsetSlide(-1)}></div>
                    <div className='movimentar-slide' onClick={() => this.offsetSlide(1)}></div>
                </div>
                <button id='ativar-tela-cheia' onClick={this.toggleFullscreen.bind(this)} 
                    style={{opacity: this.state.screen.opacidadeBotao, color: this.props.slidePreview.estilo.texto.color, 
                            width: 140*this.state.screen.proporcao + 'px', height: 140*this.state.screen.proporcao + 'px',
                            right: 7.5*this.state.screen.proporcao + 'vh', bottom: 6.5*this.state.screen.proporcao + 'vh'}}
                    onMouseOver={this.tornarBotaoVisivel} onMouseLeave={this.tornarBotaoInvisivel}>
                    {this.state.screen.icone}
                </button>
            </div>
        )
    }
}

const Img = ({imagem}) => (
    <>
        <img id='fundo-preview'  src={require('' + imagem)} alt='' />
    </>
);

const mapStateToProps = function (state) {
    var marcaDagua = null;
    var corTexto = state.slidePreview.estilo.texto.color
    if (state.slidePreview.eMestre) {
        marcaDagua = (<div className='container-marca-dagua-slide-mestre'>                         
            <div className='container-interno-marca-dagua'>
                <div className='marca-dagua-slide-mestre' style={{color: corTexto}}>SLIDE-MESTRE</div>
            </div>
        </div>);
    }
    return {slidePreview: state.slidePreview, marcaDagua: marcaDagua, realce: state.realce}
    
}

export default connect(mapStateToProps)(Preview);