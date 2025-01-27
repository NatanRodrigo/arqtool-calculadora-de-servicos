import React, { useEffect, useState } from 'react';
import "../Home/Home.css";
import axios from 'axios';
import { Navigate, useNavigate } from "react-router-dom";


const CadastrarEtapasProjeto = () => {
    const projetoId = localStorage.getItem('ProjetoId');
    const urlBase = localStorage.getItem('urlBase');
    const token = localStorage.getItem('token');

    const navigate = useNavigate();
    const [currentActivity, setCurrentActivity] = useState({ nome: '', duracaoEmHoras: '' });
    const [currentStageActivities, setCurrentStageActivities] = useState([]);
    const [stages, setStages] = useState([]);
    const [projeto, setProjeto] = useState({});
    const [selectedStageId, setSelectedStageId] = useState(0);
    const [currentStageComplexity, setCurrentStageComplexity] = useState('');
    const [modoVisualizar, setModoVisualizar] = useState(false);

    const goToHome = () => {
        navigate('/home');
    }

    const handleSubmitStage = async (event) => {
        event.preventDefault();

        // Validação dos dados da etapa
        if (currentStageActivities.length === 0 || !currentStageComplexity) {
            alert('Por favor, adicione atividades e selecione a complexidade da etapa.');
            return;
        }

        const rotaEndpoint = 'Projeto/' + projetoId + "/cadastrarEtapa";
        const urlCompleta = urlBase + rotaEndpoint;

        // Objeto com os dados da etapa
        const stageData = {
            etapaId: 0,
            projetoId: parseFloat(projetoId),
            atividades: currentStageActivities,
            complexidade: parseInt(currentStageComplexity),
            valorDaEtapa: 0,
            quantidadeHoras: 0
        };

        // console.log(urlCompleta);
        // console.log(stageData);

        try {
            const response = await axios.post(urlCompleta, stageData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            setCurrentStageActivities([]);
            setCurrentStageComplexity('');
            getEtapas();
            getProjetoById(projetoId);
        } catch (error) {
            alert('Ocorreu um Erro.');
            console.error(error);
        }
    };


    const handleComplexityChange = (event) => {
        setCurrentStageComplexity(event.target.value);
    };


    const handleActivityNameChange = (event) => {
        setCurrentActivity({ ...currentActivity, nome: event.target.value });
    };

    const handleActivityDurationChange = (event) => {
        setCurrentActivity({ ...currentActivity, duracaoEmHoras: parseFloat(event.target.value) });
    };

    const handleAddActivity = (event) => {
        event.preventDefault();
        setCurrentStageActivities([...currentStageActivities, currentActivity]);
        setCurrentActivity({ nome: '', duracaoEmHoras: '' }); // Limpa o formulário
    };

    const getValueToFixed = (value) => {
        if (value == null) {
            return 0;
        }

        const numberValue = parseFloat(value);
        return numberValue.toFixed(2);
    }

    const obterComplexidadeString = (value) => {
        switch (value) {
            case 1:
                return 'Baixa'
            case 2:
                return 'Média'
            case 3:
                return 'Alta'
            case 4:
                return 'Muito Alta'
        }
    }

    const getDuracaoHorasEtapas = (etapaId) => {
        const etapa = stages.find(stage => stage.etapaId === etapaId);
        return etapa ? etapa.quantidadeHoras : null;
    }

    const getValorTotalEtapa = (etapaId) => {
        const etapa = stages.find(stage => stage.etapaId === etapaId);
        return etapa ? etapa.valorDaEtapa : null;
    }    

    const getEtapas = async () => {
        const rotaEndpoint = 'Projeto/' + projetoId + "/etapas";
        const urlCompleta = urlBase + rotaEndpoint;

        try {
            const response = await axios.get(urlCompleta, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data.data);
            setStages(response.data.data);
        } catch (error) {
            console.error("Ocorreu um erro na sua solicitação: ", error);
        }
    }

    const goToCalcularProjeto = () => {
        navigate('/projeto');
    }

    const getProjetoById = async (projetoId) => {
        const rotaEndpoint = 'Projeto/' + projetoId;
        const urlCompleta = urlBase + rotaEndpoint;

        try {
            const response = await axios.get(urlCompleta, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data.data);
            setProjeto(response.data.data);
        } catch (error) {
            console.error(error);
        } 
    }

    const consultarAtividadesDeUmaEtapa = async (etapaId) => {
        const rotaEndpoint = 'Projeto/' + etapaId + '/atividades';
        const urlCompleta = urlBase + rotaEndpoint;

        try {
            const response = await axios.get(urlCompleta, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data.data);
            setCurrentStageActivities(response.data.data);
            setSelectedStageId(etapaId);
            setModoVisualizar(true);
        } catch (error) {
            console.error(error);
        }
    }

    const changeModoVisualizar = () => {
        setCurrentStageActivities([]);
        setModoVisualizar(!modoVisualizar);
    }

    const removerAtividadePorIndex = (index) => {
        var atividade = currentStageActivities[index];
        console.log(atividade);
        if (!atividade.atividadeId) {
            setCurrentStageActivities(current => current.filter((_, i) => i !== index));
        } else {
            var atividadeId = atividade.atividadeId;
            console.log(atividadeId);
            deleteAtividade(atividadeId);
        }

    };

    const deleteAtividade = async (id) => {
        var rota = 'Projeto/atividade/' + id;
        var urlCompleta = urlBase + rota;

        // Adiciona uma caixa de confirmação
        if (window.confirm('Tem certeza que deseja excluir a atividade?')) {
            try {
                const response = await axios.delete(urlCompleta, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response.data);
                await consultarAtividadesDeUmaEtapa(selectedStageId);
                getEtapas();
                setModoVisualizar(false);
            } catch (error) {
                console.error(error);
            }
        } else {
            // O usuário clicou em "Cancelar", então não faz nada
            console.log('A exclusão foi cancelada pelo usuário.');
        }
    }

    const deleteEtapa = async (id) => {
        var rota = 'Projeto/etapa/' + id;
        var urlCompleta = urlBase + rota;

        // Adiciona uma caixa de confirmação
        if (window.confirm('Tem certeza que deseja excluir a etapa?')) {
            try {
                const response = await axios.delete(urlCompleta, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response.data);
                getEtapas();
                setCurrentStageActivities([]);
                setModoVisualizar(false);
            } catch (error) {
                console.error(error);
            }
        } else {
            // O usuário clicou em "Cancelar", então não faz nada
            console.log('A exclusão foi cancelada pelo usuário.');
        }
    }

    

    useEffect(() => {
        getEtapas();
        getProjetoById(projetoId);
    }, []);

    return (
        <div id="home-page">
            <header id="header-etapas" className="bg-blue">
                <button onClick={goToHome} className='back-button'></button>
                <h1 className='title-header'>Etapas do Projeto</h1>
            </header>
            {/* <button onClick={consoleLogEverything}>ÉAN</button> */}

            <div className='container-lista-etapas'>
                <main id="main-content-etapas">

                    <div className='row-etapas-one'>
                        <form className='form-activity-etapas' onSubmit={handleAddActivity}>
                            <label className='label-activity-etapas'>Cadastrar Atividade:</label>
                            <input
                                type="text"
                                value={currentActivity.nome}
                                onChange={handleActivityNameChange}
                                placeholder="Nome da Atividade"
                                readOnly={modoVisualizar} // Torna o campo somente leitura se modoVisualizar for true
                                required
                            />
                            <input
                                type="number"
                                value={currentActivity.duracaoEmHoras}
                                onChange={handleActivityDurationChange}
                                placeholder="Duração em Horas"
                                readOnly={modoVisualizar} // Torna o campo somente leitura se modoVisualizar for true
                                required
                            />

                            {modoVisualizar ? (
                                <button onClick={changeModoVisualizar} className='btn-limpar-atividades'>Ocultar Atividades</button>
                            ) : (
                                <button className='btn-register-stage' type="submit" disabled={modoVisualizar}>Adicionar Atividade</button>
                            )}


                        </form>

                        <div class="complexity-container">
                            <label class="complexity-label" htmlFor="complexity">Complexidade da Etapa:</label>
                            <select class="complexity-select" id="complexity" value={currentStageComplexity} onChange={handleComplexityChange} required>
                                <option value="">Selecione a Complexidade</option>
                                <option value="1">Baixa</option>
                                <option value="2">Média</option>
                                <option value="3">Alta</option>
                                <option value="4">Muito Alta</option>
                            </select>
                            <button class="complexity-button" onClick={handleSubmitStage} disabled={modoVisualizar}>Cadastrar Etapa</button>                        </div>

                    </div>

                    <div className='row-etapas-two'>

                        <div className='etapas-column-left'>
                            Atividades
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nome da Atividade</th>
                                        <th>Duração (Horas)</th>
                                        <th>Valor</th>
                                        <th>Ação</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentStageActivities.map((activity, index) => (
                                        <tr className="projeto-row" key={index}>
                                            <td className='cell-content'>{activity.nome}</td>
                                            <td className='cell-content'>{activity.duracaoEmHoras}</td>
                                            <td className='cell-content'>R$ {getValueToFixed(activity.valor)}</td>
                                            <td><button className='btn-remove' onClick={() => removerAtividadePorIndex(index)}>Remover</button></td>
                                        </tr>
                                    ))}
                                </tbody>

                                {currentStageActivities && currentStageActivities.length > 0 && (
                                    <tfoot>
                                        <tr>
                                            <th></th>
                                            <th>Total Horas: {getValueToFixed(getDuracaoHorasEtapas(selectedStageId))}</th>
                                            <th>Valor Total: R$ {getValueToFixed(getValorTotalEtapa(selectedStageId))}</th>
                                            <th></th>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>


                        <div className='atividades-column-right'>

                            Etapas
                            <table class="etapas-table">
                                <thead>
                                    <tr>
                                        <th>Número de Atividades</th>
                                        <th>Complexidade</th>
                                        <th>Quantidade Horas</th>
                                        <th>Valor Total Etapa</th>
                                        <th>Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stages.map((stage, index) => (
                                        <tr className="projeto-row" key={index} onClick={() => consultarAtividadesDeUmaEtapa(stage.etapaId)}>
                                            <td className='cell-content'>{stage.atividades.length}</td>
                                            <td className='cell-content'>{obterComplexidadeString(stage.complexidade)}</td>
                                            <td className='cell-content'>{stage.quantidadeHoras}</td>
                                            <td className='cell-content'>R$ {getValueToFixed(stage.valorDaEtapa)}</td>
                                            <td><button className='btn-remove' onClick={() => deleteEtapa(stage.etapaId)}>Remover</button></td>
                                        </tr>
                                    ))}
                                </tbody>

                                {stages && stages.length > 0 && (
                                    <tfoot>
                                        <tr>
                                            <th>Total Atividades: {projeto.quantidadeAtividades}</th>
                                            <th>Complexidade: {obterComplexidadeString(projeto.complexidadeMedia)}</th>
                                            <th>Total Horas: {getValueToFixed(projeto.quantidadeHoras)}</th>
                                            <th>Total Etapas: R$ {getValueToFixed(projeto.valorTotalDasEtapas)}</th>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                )}

                            </table>
                        </div>
                    </div>


                    <div>
                        <button onClick={goToCalcularProjeto} className='btn-next-etapas'>Próximo</button>
                    </div>
                </main>
            </div>

            <footer id="footer" className="bg-blue">
                <h1 id="footer-title">ArqTool</h1>
            </footer>
        </div>

    );
};

export default CadastrarEtapasProjeto;
