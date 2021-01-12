import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';
import Estrofes from './Estrofes';
import { getFonteBase } from '../../principais/Element';
import { getPathImagem } from './Img';
import { limparHighlights } from '../NavBar/BarraPesquisa/BarraPesquisa';
import { markupParaSuperscrito } from '../Preview/TextoPreview';
import { ratioTela } from '../../principais/firestore/apresentacoesBD';
import ImagemSlide from './ImagemSlide';
import BotaoReupload from './BotaoReupload';

class SlideFormatado extends Component {
    
    constructor (props) {
        super(props);
        var realcarElemento = () => {};
        this.realcarElemento = props.realcarElemento || realcarElemento;
    }
    
    editarTexto = e => {
        clearTimeout(this.timeoutEditar);
        this.timeoutEditar = setTimeout(div => {
            var dados = div.id.split('-');
            var [ objeto, numero ] = [ dados[0], dados[1] ]; 
            var objAction = {
                type: 'editar-slide', 
                objeto: objeto, 
                valor: markupParaSuperscrito(limparHighlights(div.innerHTML)), 
                redividir: true, 
                selecionado: this.props.selecionado
            };
            if (numero) objAction.numero = numero;
            this.props.dispatch(objAction);
        }, 1000, e.target);
    }

    
    ativarRealce = aba => this.props.dispatch({type: 'ativar-realce', abaAtiva: aba});

    getClasseLetraClara = nomeObjeto => {
        var cor = this.props.slidePreview.estilo[nomeObjeto].color;
        if (!cor) return '';
        var eClara = true;
        var corRGB = cor.replace('rgb(', '').replace(')', '').split(',');
        for (var i = 0; i < 3; i++) {
            if (Number(corRGB[i]) < 210) {
                eClara = false;
                break;
            }
        }
        return eClara ? 'letra-clara' : '';   
    }
    
    getBlocoTitulo(slidePreview, sel) {
        return <div className={'slide-titulo ' + this.getClasseLetraClara('titulo')} style={slidePreview.estilo.titulo}>
            <div><span key={sel.elemento + '.' + sel.slide} id='textoTitulo' onInput={this.editarTexto} onFocus={() => this.ativarRealce('titulo')}
                contentEditable={this.props.editavel} suppressContentEditableWarning='true'
                style={this.realcarElemento('titulo')}>{slidePreview.titulo}</span></div>
        </div>;
    }

    getEstiloImagem = (estImagem, proporcao) => ({
        ...estImagem, 
        borderRadius: Number((estImagem.borderRadius || '').replace('px', ''))*proporcao + 'px'
    })

    reupload = () => {
        alert('todo')
    }

    render() {
        let { slidePreview, proporcao, selecionado, editavel, referencia, id, className, ratio, style, children } = this.props
        var proporcaoTela = proporcao*ratio.width/ratioTela.width;
        return (
                <div ref={referencia} 
                     id={id} 
                     className={className}
                     style={{width: ratio.width*proporcao, 
                             height: ratio.height*proporcao,
                             ...this.realcarElemento('tampao', 'dentro'),
                             ...style}}>
                    {!slidePreview.imagem ? null 
                        : <ImagemSlide key={selecionado.elemento + '.' + selecionado.slide} 
                                       imagem={slidePreview.imagem} 
                                       estiloImagem={this.getEstiloImagem(slidePreview.estilo.imagem, proporcao)} 
                                       estiloRealce={this.realcarElemento('imagem')}
                                       editavel={editavel}/>
                    }
                    <Img imagem={slidePreview.estilo.fundo} 
                         proporcao={proporcaoTela} 
                         tampao={slidePreview.estilo.tampao} 
                         botaoInativo={!editavel || typeof slidePreview.estilo.fundo.path === 'string' || (slidePreview.imagem && slidePreview.imagem.idUpload)}
                         selecionado={selecionado}/>
                    <div className='texto-preview' style={{fontSize: getFonteBase().numero*proporcao + getFonteBase().unidade}}>
                        {slidePreview.estilo.titulo.abaixo ? null : this.getBlocoTitulo(slidePreview, selecionado)}
                        <div id='paragrafo-slide' className={'slide-paragrafo ' + this.getClasseLetraClara('paragrafo')} style={slidePreview.estilo.paragrafo}>
                            <div style={this.realcarElemento('paragrafo')} 
                                 className={'realce-paragrafo ' + (slidePreview.estilo.paragrafo.duasColunas ? 'dividido-colunas' : '')}>
                                {<Estrofes slidePreview={slidePreview} onInput={this.editarTexto} ativarRealce={this.ativarRealce} editavel={editavel}
                                           selecionado={selecionado}/>}
                            </div>
                        </div>
                        {slidePreview.estilo.titulo.abaixo ? this.getBlocoTitulo(slidePreview, selecionado) : null}
                    </div>
                    {children}
                </div>
        )
    }
}

const ImgNormal = ({corTampao, strBackground, mixBlendMode, reupload, src, botaoInativo}) => (
    <div className='imagem-fundo-preview' style={{backgroundImage: strBackground}}>
        <div className='tampao' style={{backgroundColor: corTampao, mixBlendMode}}/>
        <BotaoReupload callbackReupload={reupload} src={src} inativo={botaoInativo}/>
    </div>
)

export const Img = ({imagem, proporcao, tampao, botaoInativo, selecionado}) => {
    const reupload = () => {
        alert('todo', selecionado);
    }

    var strBackground = '';
    var strPrincipal;
    if (imagem.src) {
        strBackground += 'url("' + imagem.src + '")';
    } else if(imagem.path) {
        var pixeis = [[null, 0.65], [600, 0.3], [300, 0]];
        strBackground += pixeis.reduce((resultado, px) => {
            if(px[1] < proporcao) {
                var strUrl = 'url("' + require('' + getPathImagem(imagem.path, px[0])) + '")';
                if (!strPrincipal) strPrincipal = strUrl;
                resultado.push(strUrl)
            }
            return resultado;            
        }, []).join(', ');
    }
    return (
        <ImgNormal corTampao={tampao.backgroundColor} 
                   strBackground={strBackground} 
                   mixBlendMode={tampao.mixBlendMode} 
                   botaoInativo={botaoInativo} 
                   reupload={reupload}
                   src={imagem.src}/>
    )
};

const mapState = function (state) {
    const sP = state.present;
    return {abaAtiva: sP.abaAtiva, ratio: sP.ratio, selecionado: sP.selecionado}
}

export default connect(mapState)(SlideFormatado);