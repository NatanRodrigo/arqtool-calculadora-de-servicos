import React, { useState, useEffect } from 'react';
import './Despesas.css';
import axios from 'axios';
import { Navigate, useNavigate } from "react-router-dom";

const Despesas = () => {

    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const urlBase = localStorage.getItem('urlBase');
    const token = localStorage.getItem('token');

    const [despesas, setDespesas] = useState([{
        despesaId: '',
        usuarioId: userId,
        nome: '',
        gastoMensal: '',
        porcentagemGastoTotal: '',
        gastoAnual: '',
        hora: '',
        valorTotal: ''
    }]);

    const addDespesa = async () => {
        const nome = document.getElementById('expense-name').value;
        const gastoMensal = document.getElementById('monthly-cost').value;

        if (!nome || !gastoMensal) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        const data = [{
            despesaId: 0,
            usuarioId: userId,
            nome: nome,
            gastoMensal: gastoMensal
        }]

        const rotaEndpoint = 'DespesasMensais';
        const urlCompleta = urlBase + rotaEndpoint;

        try {
            const response = await axios.post(urlCompleta, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // alert(response.data.message);
            getDespesasUsuario();
        } catch (error) {
            console.error(error);
        }

    }

    const getDespesasUsuario = async () => {
        const rotaEndpoint = 'DespesasMensais/Usuario';
        const urlCompleta = urlBase + rotaEndpoint;

        try {
            const response = await axios.get(urlCompleta, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });                 
            setDespesas(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }

    const getValueToFixed = (value) => {
        const numberValue = parseFloat(value);
        return numberValue.toFixed(2);
    }
    

    const deleteDespesa = async (id) => {
        const rotaEndpoint = 'DespesasMensais/';
        const urlCompleta = urlBase + rotaEndpoint + id;

        try {
            const response = await axios.delete(urlCompleta, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            //alert(response.data.message);
            getDespesasUsuario();
        } catch (error) {
            console.error(error);
        }
    }

    const goToPretensoes = () => {
        navigate('/valor-hora');
      };
    
      const goToDespesas = () => {
        navigate('/despesas');
      }
    
      const goToHoraTecnica = () => {
        navigate('/hora-tecnica');
      }


    useEffect(() => {
        getDespesasUsuario();
    }, []);

    const toNextPage = () => {
        navigate('/valor-hora');
    };

    return (
        <div className="container">
            <div>
                <div className="col-sm-8 col-sm-offset-2">
                    <div className="wizard-container">
                        <div className="card wizard-card" data-color="blue" id="wizard">
                            <div action="" method="" noValidate="novalidate">
                                <div className="wizard-header">
                                    <h3 className="wizard-title">Calculadora ArqTool</h3>
                                    <h5>Saiba o quanto cobrar por um Projeto Arquitetônico.</h5>
                                </div>
                                <div className="wizard-navigation">
                                    <ul className="nav nav-pills">
                                        <li style={{ width: '25%' }} className="active">
                                            <a onClick={goToDespesas} data-toggle="tab" aria-expanded="false">Custos</a>
                                        </li>
                                        <li className="" style={{ width: '25%' }}>
                                            <a onClick={goToPretensoes} data-toggle="tab" aria-expanded="false">Pretensões</a>
                                        </li>
                                        <li style={{ width: '25%' }} className="">
                                            <a onClick={goToHoraTecnica} data-toggle="tab" aria-expanded="true">Hora Técnica</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="tab-content">
                                    <div className="tab-pane active" id="custos">
                                        <div className="col-sm-12">
                                            <h4 className="info-text">Informe suas despesas</h4>
                                        </div>
                                        <div className="input-expense">
                                            <div id="expense-form">
                                                <input type="text" id="expense-name" placeholder="Nome da despesa" />
                                                <input type="number" id="monthly-cost" placeholder="Custo mensal" />
                                                <button id="add-expense-button" onClick={addDespesa} type="button">Adicionar</button>
                                            </div>
                                        </div>
                                        <h5 className="custos-label ml-1 mr-1 mb-0">Despesas:</h5>
                                        <hr className="mt-1" />
                                        <table id="expense-table">
                                            <thead>
                                                <tr>
                                                    <th>Descrição</th>
                                                    <th>Gasto Mensal</th>
                                                    <th>Percentual Mensal</th>
                                                    <th>Gasto Anual</th>
                                                    <th>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {despesas.map((despesa) => (
                                                    <tr key={despesa.despesaId}>
                                                        <td>{despesa.nome}</td>
                                                        <td>R${despesa.gastoMensal}</td>
                                                        <td>{getValueToFixed(despesa.porcentagemGastoTotal)} %</td>
                                                        <td>R${despesa.gastoAnual}</td>
                                                        <td>
                                                            <button onClick={() => deleteDespesa(despesa.despesaId)}>Excluir</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>


                                        </table>
                                    </div>
                                </div>
                                <br />
                                <div className="wizard-footer">
                                    <div className="left-side"></div>
                                    <div className="right-side">
                                        <input type="button" onClick={toNextPage} className="btn-next" name="next" value="Próximo" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Despesas;
