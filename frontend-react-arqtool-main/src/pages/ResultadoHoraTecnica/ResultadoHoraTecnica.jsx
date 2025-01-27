import React, { useState, useEffect } from 'react';
import './ResultadoHoraTecnica.css';
import axios from 'axios';
import { Navigate, useNavigate } from "react-router-dom";


const ResultadoHoraTecnica = () => {
  const [horaTecnica, setHoraTecnica] = useState([]);

  const navigate = useNavigate();
  const urlBase = localStorage.getItem('urlBase');
  const token = localStorage.getItem('token');

  const getHoraTecnica = async () => {
    const rotaEndpoint = 'ValorIdealHoraTrabalho';
    const urlCompleta = urlBase + rotaEndpoint;

    try {
      const response = await axios.get(urlCompleta, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // console.log(response.data.data);

      setHoraTecnica(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getHoraTecnica();
  }, []);

  const goToPretensoes = () => {
    navigate('/valor-hora');
  };

  const goToDespesas = () => {
    navigate('/despesas');
  }

  const goToHoraTecnica = () => {
    navigate('/hora-tecnica');
  }

  const finalizar = () => {
    navigate('/home');
  };

  const getValueToFixed = (value) => {
    const numberValue = parseFloat(value);
    return numberValue.toFixed(2);
  }

  const formatarValorParaPorcentagem = (value) => {
    return getValueToFixed(value * 100);
  }

  const getValorReservaMes = (faturamentoMensalMinimo, percentualReservaFerias) => {
    var value = faturamentoMensalMinimo * percentualReservaFerias;
    return getValueToFixed(value);
  }

  return (
    <div className="container">
      <div>
        <div>
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
                    <li className="" style={{ width: '25%' }}>
                      <a onClick={goToPretensoes} data-toggle="tab" aria-expanded="false">Pretensões</a>
                    </li>
                    <li style={{ width: '25%' }} className="active">
                      <a onClick={goToHoraTecnica} data-toggle="tab" aria-expanded="true">Hora Técnica</a>
                    </li>
                  </ul>
                </div>
                <div className="tab-content">
                  <div className="tab-pane active" id="pretensoes">
                    <div className="row">
                      <div className='Column-hora-tecnica'>
                        <h4 className="info-text">Hora Técnica</h4>
                        <div className="input-group">
                          <div className="form-group label-floating is-empty">
                            <label className="control-label" htmlFor="salario">Valor Hora Ideal</label>
                            <span id="valorIdeal" className="form-control-valid">R$ {getValueToFixed(horaTecnica.valorIdealHoraDeTrabalho)}</span>
                          </div>
                        </div>
                        <div className="input-group">
                          <div className="form-group label-floating is-empty">
                            <label className="control-label" htmlFor="horas">Valor Hora Mínimo</label>
                            <span id="valorMinimo" className="form-control-valid">R$ {getValueToFixed(horaTecnica.valorMinimoHoraDeTrabalho)}</span>
                          </div>
                        </div>
                        <div className="input-group">
                          <div className="form-group label-floating is-empty">
                            <label className="control-label" htmlFor="horas">Faturamento Mínimo</label>
                            <span id="faturamentoMinimo" className="form-control-valid">R$ {getValueToFixed(horaTecnica.faturamentoMensalMinimo)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="Column-hora-tecnica">
                        <h4 className="info-text">Cálculo de Férias</h4>
                        <div className="input-group">
                          <div className="form-group label-floating is-empty">
                            <label className="control-label" htmlFor="horas">Valor Anual</label>
                            <span id="custoFerias" className="form-control-valid">R$ {getValueToFixed(horaTecnica.custoFerias)}</span>
                          </div>
                        </div>
                        
                        <div className="input-group">
                          <div className="form-group label-floating is-empty">
                            <label className="control-label" htmlFor="horas">Percentual Reserva Mês</label>
                            <span id="reservaPercentual" className="form-control-valid">{formatarValorParaPorcentagem(horaTecnica.percentualReservaFerias)} %</span>
                          </div>
                        </div>
                        <div className="input-group">
                          <div className="form-group label-floating is-empty">
                            <label className="control-label" htmlFor="dias">Reserva Mensal</label>
                            <span id="percentualFerias" className="form-control-valid">R$ {getValorReservaMes(horaTecnica.faturamentoMensalMinimo ,horaTecnica.percentualReservaFerias)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="wizard-footer">
                      <div className="left-side">
                        <button type="button" className="btn btn-previous btn-fill btn-default btn-wd disabled" name="previous" onClick={goToPretensoes} value="Anterior">Anterior</button>
                      </div>
                      <div className="right-side">
                        <button id="cadastrar" type="button" className="btn-next" name="next" onClick={finalizar} value="Próximo">Finalizar</button>
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

export default ResultadoHoraTecnica;
