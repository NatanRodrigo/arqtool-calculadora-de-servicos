import React, { useEffect, useState } from 'react';
import "../Home/Home.css";
import axios from 'axios';
import { Navigate, useNavigate } from "react-router-dom";

const CalcularProjeto = () => {
    const projetoId = localStorage.getItem('ProjetoId');
    const urlBase = localStorage.getItem('urlBase');
    const token = localStorage.getItem('token');

    const navigate = useNavigate();
    const [projeto, setProjeto] = useState([]);
    const [data, setData] = useState({
        projetoId: projetoId,
        dataInicial: '',
        dataFinal: '',
        quantidadeAmbientes: '',
        quantidadeAmbientesMolhados: ''
    });

    useEffect(() => {
        getProjetoById(projetoId);
    }, []);

    const getProjetoById = async (id) => {
        const rotaEndpoint = 'Projeto/';
        const urlCompleta = urlBase + rotaEndpoint + id;

        try {
            const response = await axios.get(urlCompleta, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // console.log(response.data.data);
            setProjeto(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }

    const CalcularProjeto = async (e) => {
        e.preventDefault();
        const rotaEndpoint = 'Projeto/calcular/';
        const urlCompleta = urlBase + rotaEndpoint + projetoId;
        console.log(data);
        try {
            const response = await axios.put(urlCompleta, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            alert('Projeto Atualizado com Sucesso!');
            getProjetoById(projetoId);
        } catch (error) {
            alert('Ocorreu um Erro.');
            console.error(error);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const goToHome = () => {
        navigate('/etapas-projeto');
    }

    const formatarData = (data) => {
        const dataObj = new Date(data);
        const dia = dataObj.getDate().toString().padStart(2, '0');
        const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0'); // Janeiro é 0!
        const ano = dataObj.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    const getValueToFixed = (value) => {
        const numberValue = parseFloat(value);
        return numberValue.toFixed(2);
    }

    return (
        <div id="home-page">
            <header id="header-etapas" className="bg-blue">
                <button onClick={goToHome} className='back-button'></button>
                <h1 className='title-header'>Calcular Projeto</h1>
            </header>

            <div className='container-lista'>
                <main id="main-content" className="main-content">
                    <form onSubmit={(e) => CalcularProjeto(e)} className="form-projeto">
                        <div className="form-group">
                            <label className="form-label">Data Inicial</label>
                            <input
                                type="date"
                                name="dataInicial"
                                value={data.dataInicial}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Data final</label>
                            <input
                                type="date"
                                name="dataFinal"
                                value={data.dataFinal}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Quantidade ambientes</label>
                            <input
                                type="number"
                                name="quantidadeAmbientes"
                                value={data.quantidadeAmbientes}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Quantidade ambientes molhados</label>
                            <input
                                type="number"
                                name="quantidadeAmbientesMolhados"
                                value={data.quantidadeAmbientesMolhados}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn-next-etapas">Calcular</button>
                        </div>
                    </form>
                    <div key={projeto.projetoId} className="resultado-projeto">
                        <div className="resultado-item">
                            <label className="resultado-label">Valor do Projeto:</label>
                            <span className="resultado-valor">{projeto.valorTotalProjeto ? 'R$ ' + (getValueToFixed(projeto.valorTotalProjeto) / 2)  : ''}</span>
                        </div>

                        <div className="resultado-item">
                            <label className="resultado-label">Quantidade de Horas:</label>
                            <span className="resultado-valor">{getValueToFixed(projeto.quantidadeHoras)}</span>
                        </div>
                        <div className="resultado-item">
                            <label className="resultado-label">Complexidade Média:</label>
                            <span className="resultado-valor">{projeto.complexidadeMedia}</span>
                        </div>
                        <div className="resultado-item">
                            <label className="resultado-label">Quantidade de Ambientes:</label>
                            <span className="resultado-valor">{projeto.quantidadeAmbientes}</span>
                        </div>
                        <div className="resultado-item">
                            <label className="resultado-label">Quantidade de Ambientes Molhados: </label>
                            <span className="resultado-valor">{projeto.quantidadeAmbientesMolhados}</span>
                        </div>
                        <div className="resultado-item">
                            <label className="resultado-label">Data Inicial:</label>
                            <span className="resultado-valor">{projeto.dataFinal ? formatarData(projeto.dataInicial) : ''}</span>
                        </div>
                        <div className="resultado-item">
                            <label className="resultado-label">Data Final: </label>
                            <span className="resultado-valor">
                                {projeto.dataFinal ? formatarData(projeto.dataFinal) : ''}
                            </span>
                        </div>

                    </div>
                </main>
            </div>

            <footer id="footer" className="bg-blue">
                <h1 id="footer-title">ArqTool</h1>
            </footer>
        </div>

    );
};

export default CalcularProjeto;
