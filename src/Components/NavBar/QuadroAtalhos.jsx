import React from 'react';
import { connect } from 'react-redux';
import QuadroNavbar from './QuadroNavbar';

const listaAtalhos = [{teclas: [['←'], ['↑']], acao: 'Slide anterior'},
                      {teclas: [['↑'], ['→']], acao: 'Próximo Slide'},
                      {teclas: ['Ctrl', 'Z'], acao: 'Desfazer última ação'},
                      {teclas: [['Ctrl', 'Y'], ['Ctrl', 'Shift', 'Z']], acao: 'Refazer ação desfeita'},
                      {teclas: ['Ctrl', 'L'], acao: 'Adicionar Texto Livre', autorizacao: 'editar'},
                      {teclas: ['Ctrl', 'B'], acao: 'Adicionar Texto Bíblico', autorizacao: 'editar'},
                      {teclas: ['Ctrl', 'M'], acao: 'Adicionar Música', autorizacao: 'editar'},
                      {teclas: ['Ctrl', 'I'], acao: 'Adicionar Imagem', autorizacao: 'editar'},
                      {teclas: ['Ctrl', 'D'], acao: 'Adicionar Vídeo', autorizacao: 'editar'},
                      {teclas: ['Ctrl', 'O'], acao: 'Nova Apresentação'},
                      {teclas: ['Ctrl', 'F'], acao: 'Pesquisar nos slides'}
]

const getAtalhoSeparado = teclas => ( 
    teclas.map((t, i) => {
        return (
            <>
                <div className='tecla-atalho'>{t}</div> 
                {i === teclas.length-1 ? '' : <span>  +  </span>} 
            </>
        )
    })
)

class QuadroAtalhos extends React.Component {

    render() {
        return (
            <QuadroNavbar callback={this.props.callback}>
                {listaAtalhos.map(a => {
                    if (a.autorizacao && a.autorizacao !== this.props.autorizacao) return null;
                    return (
                        <div className='instrucao-atalho'>
                            <div>
                                {Array.isArray(a.teclas[0])
                                    ? <>{a.teclas.map((t, i) => (
                                            <>
                                                {getAtalhoSeparado(t)}
                                                {i === a.teclas.length-1 ? '' : <span>  ,  </span>}
                                            </>
                                        ))}
                                    </>
                                    : getAtalhoSeparado(a.teclas)                         
                                }
                            </div>
                            <div>{a.acao}</div>
                        </div>
                    )
                })}
            </QuadroNavbar>
        );
    }
};
  
const mapState = state => (
    {autorizacao: state.present.apresentacao.autorizacao}
)

export default connect(mapState)(QuadroAtalhos);
  