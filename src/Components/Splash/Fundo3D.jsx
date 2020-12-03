import React from 'react';
import './Splash.css';
import { multiplicarArray } from '../../FuncoesGerais';
import Background from './QuadradoC.svg';

const coresQuadrados = ['azul-puro', 'azul-claro', 'cinza'];
const proporcaoWidth = 1.2614;
const taxaDiferencaQuadrado = 1.09;
const taxaInterpolacao = 0.02;
const tamanhoMinimoVw = 0.1;
const rateSombra = 0.06;
const metade = 0.5;

class Fundo3D extends React.Component {

    getShadowArray = (coordenadas, rate) => {
        var c = multiplicarArray(coordenadas, rateSombra);
        return {boxShadow: 'inset ' + c[0] + 'px ' + c[1] + 'px 10px rgba(0, 0, 0, 0.5)'}
    }

    getEstiloLeftTop = (left, top) => (
        {left: left, top: top}
    )

    render() {
        var [x, y] = this.props.coordenadas;
        var tamanhoMinimo = window.innerWidth*tamanhoMinimoVw;
        var tamanho = tamanhoMinimo;
        var arrayQuadrados = [];
        while (tamanho < window.innerWidth || tamanho/proporcaoWidth < window.innerHeight) {
            tamanho = tamanho*taxaDiferencaQuadrado;
            arrayQuadrados.push(tamanho);
        }
        const boxShadow = this.getShadowArray([x, y], taxaInterpolacao);
        return (
            <div id='fundo-animacao-3d'>
                <div id='fundo-popup' className='animacao-3d'></div>
                {arrayQuadrados.reduce((quadrados, t, i) => {
                    var [w, h] = [t, t/proporcaoWidth];
                    var taxaPad = 0.5*(1-1/(taxaDiferencaQuadrado)); 
                    quadrados = (
                        <div className={'quadrado-logo ' + coresQuadrados[i % coresQuadrados.length]} 
                             style={{width: w, height: h,
                             ...(i === arrayQuadrados.length-1 
                                    ? this.getEstiloLeftTop(Math.min((window.innerWidth - w) * metade, 0), Math.min((window.innerHeight - h) * metade, 0)) 
                                    : this.getEstiloLeftTop(w*taxaPad + x*taxaInterpolacao, h*taxaPad + y*taxaInterpolacao)),
                             ...(!i ? {backgroundImage: 'url(' + Background + ')'} : {}),
                             ...boxShadow
                        }}>
                            {quadrados}
                        </div>
                    )
                    return quadrados;
                }, 
                    <></>
                )}
            </div>
        );
    }
};
  
export default Fundo3D;

//paddingLeft: (w*taxaPad + x*taxaInterpolacao) + 'px', paddingTop: (h*taxaPad + y*taxaInterpolacao) + 'px',
