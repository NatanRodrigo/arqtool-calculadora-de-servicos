import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import axios from 'axios';



const CalcularHoraTecnica = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const urlBase = localStorage.getItem('urlBase');
    const token = localStorage.getItem('token');

    const [horaTecnica, setHoraTecnica] = useState({});
    const [hasCalculado, setHasCalculado] = useState(false);

    const getHoraTecnica = async () => {
        const rotaEndpoint = 'ValorIdealHoraTrabalho';
        const urlCompleta = urlBase + rotaEndpoint;

        try {
            const response = await axios.get(urlCompleta, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setHasCalculado(true);
            setHoraTecnica(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const fetchHoraTecnica = async () => {
            await getHoraTecnica();
        };
    
        fetchHoraTecnica();
    }, []);

    const handleRequest = async () => {
        const horasTrabalhadasPorDia = parseFloat(document.getElementById('horas').value);
        const diasTrabalhadosPorSemana = parseFloat(document.getElementById('dias').value);
        const diasFeriasPorAno = parseFloat(document.getElementById('ferias').value);
        const faturamentoMensalDesejado = parseFloat(document.getElementById('salario').value);
        const reservaFinanceira = parseFloat(document.getElementById('reserva').value);

        if (!horasTrabalhadasPorDia || !diasTrabalhadosPorSemana || !diasFeriasPorAno || !faturamentoMensalDesejado || !reservaFinanceira) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        const rotaEndpoint = 'ValorIdealHoraTrabalho';
        const urlCompleta = urlBase + rotaEndpoint;

        if (!hasCalculado) {
            const data = {
                usuarioId: userId,
                horasTrabalhadasPorDia: horasTrabalhadasPorDia,
                diasTrabalhadosPorSemana: diasTrabalhadosPorSemana,
                diasFeriasPorAno: diasFeriasPorAno,
                faturamentoMensalDesejado: faturamentoMensalDesejado,
                reservaFinanceira: reservaFinanceira
            };
            try {
                const response = await axios.post(urlCompleta, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // console.log(response.data);
                alert('Pretensões cadastradas com sucesso!');
                getHoraTecnica();
            } catch (error) {
                alert('Ocorreu um Erro.');
                console.error(error);
            }
    
        } else {
            try {
                const data = {
                    id: horaTecnica.id,
                    usuarioId: userId,
                    horasTrabalhadasPorDia: horasTrabalhadasPorDia,
                    diasTrabalhadosPorSemana: diasTrabalhadosPorSemana,
                    diasFeriasPorAno: diasFeriasPorAno,
                    faturamentoMensalDesejado: faturamentoMensalDesejado,
                    reservaFinanceira: reservaFinanceira
                };
                const response = await axios.put(urlCompleta, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // console.log(response.data);
                alert('Pretensões atualizadas com sucesso!');
                getHoraTecnica();
            } catch (error) {
                console.error(error);
            }
    
        }

        
    };

    const handleValorHoraChange = (event) => {
        setHoraTecnica({
            ...horaTecnica,
            [event.target.name]: event.target.value
        });
        
    };


    const goToPretensoes = () => {
        navigate('/valor-hora');
    };

    const goToDespesas = () => {
        navigate('/despesas');
    }

    const goToHoraTecnica = () => {
        navigate('/hora-tecnica');
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-8 col-sm-offset-2">
                    <div className="wizard-container">
                        <div className="card wizard-card" data-color="blue" id="wizard">
                            <form action="" method="" noValidate="novalidate">
                                <div className="wizard-header">
                                    <h3 className="wizard-title">Calculadora ArqTool</h3>
                                    <h5>Saiba o quanto cobrar por um Projeto Arquitetônico.</h5>
                                </div>
                                <div className="wizard-navigation">
                                    <ul className="nav nav-pills">
                                        <li style={{ width: '25%' }} className="">
                                            <a onClick={goToDespesas} data-toggle="tab" aria-expanded="false">Custos</a>
                                        </li>
                                        <li className="active" style={{ width: '25%' }}>
                                            <a onClick={goToPretensoes} data-toggle="tab" aria-expanded="false">Pretensões</a>
                                        </li>
                                        <li style={{ width: '25%' }} className="">
                                            <a onClick={goToHoraTecnica} data-toggle="tab" aria-expanded="true">Hora Técnica</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="tab-content">
                                    <div className="tab-pane active" id="pretensoes">
                                        <div className="title-hora-tecnica">
                                            <h4 className="info-text">Informe as suas pretensões</h4>
                                        </div>
                                        <div className="row">

                                            <div className="column-valor-hora">
                                                <div className="input-group">
                                                    <div className="form-group label-floating is-empty">
                                                        <label className="control-label" htmlFor="salario">
                                                            Qual é a receita mensal que você deseja alcançar?
                                                        </label>
                                                        <input
                                                            onChange={handleValorHoraChange}
                                                            name="faturamentoMensalDesejado"
                                                            id="salario"
                                                            type="number"
                                                            className="form-control valid"
                                                            value={horaTecnica.faturamentoMensalDesejado}
                                                        />

                                                        {/* <span className="material-input"></span> */}
                                                    </div>
                                                </div>
                                                <div className="input-group">
                                                    <div className="form-group label-floating is-empty">
                                                        <label className="control-label" htmlFor="horas">Planeja reservar algum
                                                            valor para emergências ou investimentos? Se sim,
                                                            quanto?</label>
                                                        <input
                                                            onChange={handleValorHoraChange}
                                                            name="reservaFinanceira"
                                                            id="reserva"
                                                            type="number"
                                                            className="form-control valid"
                                                            value={horaTecnica.reservaFinanceira} />
                                                        {/* <span className="material-input"></span> */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column-valor-hora">
                                                <div className="input-group">
                                                    <div className="form-group label-floating is-empty">
                                                        <label className="control-label" htmlFor="horas">Quantas horas
                                                            você pretende trabalhar por dia?</label>
                                                        <input
                                                            onChange={handleValorHoraChange}
                                                            name="horasTrabalhadasPorDia"
                                                            id="horas"
                                                            type="number"
                                                            className="form-control valid"
                                                            value={horaTecnica.horasTrabalhadasPorDia} />
                                                        {/* <span className="material-input"></span> */}
                                                    </div>
                                                </div>
                                                <div className="input-group">
                                                    <div className="form-group label-floating is-empty">
                                                        <label className="control-label" htmlFor="dias">Quantos dias
                                                            você pretende trabalhar por semana?</label>
                                                        <input
                                                            onChange={handleValorHoraChange}
                                                            name="diasTrabalhadosPorSemana"
                                                            id="dias"
                                                            type="number"
                                                            className="form-control valid"
                                                            value={horaTecnica.diasTrabalhadosPorSemana} />
                                                        {/* <span className="material-input"></span> */}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="column-valor-hora">
                                            <div className="input-group">
                                                <div className="form-group label-floating is-empty">
                                                    <label className="control-label" htmlFor="horas">
                                                        Quantos dias de férias você planeja tirar durante o ano?
                                                    </label>
                                                    <input
                                                        onChange={handleValorHoraChange}
                                                        name="diasFeriasPorAno"
                                                        id="ferias"
                                                        type="number"
                                                        className="form-control-input"
                                                        value={horaTecnica.diasFeriasPorAno} />
                                                    {/* <span className="material-input"></span> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="wizard-footer">
                                            <div className="left-side">
                                                <button type="button"
                                                    className="btn btn-previous btn-fill btn-default btn-wd disabled"
                                                    name="previous" onClick={goToDespesas} value="Anterior">Anterior
                                                </button>
                                            </div>
                                            <div className="right-side">
                                                <button id="cadastrar" type="button" onClick={handleRequest} className="btn-next" name="next"
                                                    value="Próximo">Cadastrar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalcularHoraTecnica;
