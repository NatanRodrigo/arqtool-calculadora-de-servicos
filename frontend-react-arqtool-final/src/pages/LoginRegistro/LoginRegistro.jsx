import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginRegistro.css';
import axios from 'axios';

function LoginRegistro() {
    const [dataLogin, setDataLogin] = useState({
        email: '',
        senha: ''
    });

    const [dataRegistro, setDataRegistro] = useState({
        nome: '',
        dataNascimento: '',
        telefone: '',
        email: '',
        senha: '',
        confirmacaoSenha: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        logout();
    }, []);

    const urlBase = localStorage.getItem('urlBase');

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    const handleRegistro = async () => {
        console.log(dataRegistro);

        if (!validarCampos(dataRegistro)) {
            return;
        }

        const rotaEndpoint = 'v1/Usuario/Registro';
        const urlCompleta = urlBase + rotaEndpoint;
        try {
            const resposta = await axios.post(urlCompleta, dataRegistro);
            alert(resposta.data);
        } catch (erro) {
            alert('Ocorreu um Erro.');
            console.error(erro);
        }
    }

    const handleLogin = async () => {
        console.log(dataLogin);

        if (!validarCampos(dataLogin)) {
            return;
        }

        const rotaEndpoint = 'v1/Usuario/Login';
        const urlCompleta = urlBase + rotaEndpoint;
        try {
            const resposta = await axios.post(urlCompleta, dataLogin);
            const data = resposta.data;
            var userId = await getUserInfo(data.token);
            // console.log(userId);
            localStorage.setItem('userId', userId);
            localStorage.setItem('token', data.token);
            localStorage.setItem('expiration', data.expiration);

            var isRecorrente = await verificarUsuarioRecorrente(data.token);
            if (isRecorrente) {
                navigate("/home");
            } else {
                navigate('/despesas');
            }


        } catch (erro) {
            alert('Ocorreu um Erro.');
            console.error(erro);
        }
    }

    const verificarUsuarioRecorrente = async (token) => {
        const rotaEndpoint = 'ValorIdealHoraTrabalho';
        const urlCompleta = urlBase + rotaEndpoint;

        try {
            const response = await axios.get(urlCompleta, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // console.log(response.data.data);

            return true;
        } catch (error) {
            return false;
        }
    }

    const getUserInfo = async (token) => {
        const rotaEndpoint = 'v1/Usuario/Info';
        const urlCompleta = urlBase + rotaEndpoint;

        try {
            const response = await axios.get(urlCompleta, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.id; // Certifique-se de que a resposta tem uma propriedade 'id'
        } catch (error) {
            console.error(error);
        }
    }

    const handleRegistroChange = (event) => {
        setDataRegistro({
            ...dataRegistro,
            [event.target.name]: event.target.value
        });
    };

    const handleLoginChange = (event) => {
        setDataLogin({
            ...dataLogin,
            [event.target.name]: event.target.value
        });
    };

    const validarCampos = (data) => {
        for (let campo in data) {
            if (!data[campo]) {
                alert(`Por favor, preencha o campo ${campo}`);
                return false;
            }
        }
        return true;
    }

    const toggleClass = () => {
        const body = document.body;

        if (body.className == "sign-in-js") {
            // console.log(body.classList);
            body.className = "";
        } else {
            // console.log(body.classList);
            body.className = "sign-in-js";
        }
    }

    return (
        <body>

            {/* Início Login */}
            <div className="container">
                <div className="content first-content">
                    <div className="first-column">
                        <h2 className="title title-primary">ArqTool</h2>
                        <p className="description description-primary">Bem-vindo de volta!</p>
                        <p className="description description-primary">Acesse sua conta agora mesmo.</p>
                        <button onClick={toggleClass} id="signin" className="btn btn-primary">ENTRAR</button>
                    </div>

                    <div className="second-column">
                        <h2 className="title title-second">Cadastrar</h2>
                        <div className="form">

                            <label className="label-input">
                                <i className="far fa-envelope icon-modify"></i>
                                <input id="nomeCompletoR" name="nome" type="text" placeholder="Nome e Sobrenome" onChange={handleRegistroChange} />
                            </label>

                            <label className="label-input">
                                <i className="far fa-envelope icon-modify"></i>
                                <input id="emailR" name="email" type="email" placeholder="Email" onChange={handleRegistroChange} />
                            </label>
                            <label className="label-input">
                                <i className="fas fa-lock icon-modify"></i>
                                <input id="dataNascimentoR" name="dataNascimento" type="date" placeholder="Data de nascimento" onChange={handleRegistroChange} />
                            </label>
                            <label className="label-input">
                                <i className="fas fa-lock icon-modify"></i>
                                <input id="telefoneR" name="telefone" type="tel" placeholder="Telefone" onChange={handleRegistroChange} />
                            </label>
                            <label className="label-input">
                                <i className="fas fa-lock icon-modify"></i>
                                <input id="senhaR" name="senha" type="password" placeholder="Senha" onChange={handleRegistroChange} />
                                <button className="btnTgR" type="button" tabIndex="-1">
                                    {/* <img className="fechadoR" src="./assets/olho-fechado.png" alt="olho fechado" /> */}
                                </button>
                            </label>
                            <label className="label-input">
                                <i className="fas fa-lock icon-modify"></i>
                                <input id="confirmacaoSenhaR" name="confirmacaoSenha" type="password" placeholder="Confirmação da senha" onChange={handleRegistroChange} />
                                {/* <button className="btnTgR" type="button" tabindex="-1">
            {/* <img className="fechadoR" src="./assets/olho-fechado.png" alt="olho fechado" /> 
          </button> */}
                            </label>

                            <button onClick={handleRegistro} className="btn btn-second">CADASTRAR</button>
                        </div>
                    </div>
                </div>


                {/* Fim Login */}

                {/* Início Registro */}
                <div className="content second-content">
                    <div className="first-column">
                        <h2 className="title title-primary">ArqTool</h2>
                        <p className="description description-primary">Olá amigo!</p>
                        <p className="description description-primary">Insira seus dados e comece a calcular seus projetos.</p>
                        <button onClick={toggleClass} id="signup" className="btn btn-primary">CADASTRAR</button>
                    </div>
                    <div className="second-column">
                        <h2 className="title title-second">Entrar</h2>
                        <p className="description description-second">Faça seu login usando email e senha.</p>
                        <div className="form">
                            <label className="label-input">
                                <i className="far fa-envelope icon-modify"></i>
                                <input id="emailL" name="email" onChange={handleLoginChange} type="email" placeholder="Email" />
                            </label>
                            <label className="label-input">
                                <i className="fas fa-lock icon-modify"></i>
                                <input id="senhaL" name="senha" onChange={handleLoginChange} type="password" placeholder="Senha" />
                                {/* <button className="btnTgL" type="button" tabIndex="-1">
          {/* <img className="fechadoL" src="./assets/olho-fechado.png" alt="olho fechado" /> 
        </button> */}
                            </label>
                            <a className="password">Esqueceu a senha?</a>
                            <button onClick={handleLogin} className="btn btn-second">ENTRAR</button>
                        </div>
                    </div>
                </div>

            </div>
            {/* Fim Registro */}
        </body >
    );
}

export default LoginRegistro;