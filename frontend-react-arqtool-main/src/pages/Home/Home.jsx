import React, { useEffect, useState } from 'react';
import "./Home.css";
import axios from 'axios';
import { Navigate, useNavigate } from "react-router-dom";


const Home = () => {
    // const userId = localStorage.getItem('userId');
    const urlBase = localStorage.getItem('urlBase');
    const token = localStorage.getItem('token');

    const navigate = useNavigate();
    const [projetos, setProjetos] = useState([]);
    const [menuAberto, setMenuAberto] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nomeNovoProjeto, setNomeNovoProjeto] = useState('');

    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }


    useEffect(() => {
        getProjetos();
    }, []);

    const handleProjectNameChange = (event) => {
        setNomeNovoProjeto(event.target.value);
    }

    const fecharMenu = (event) => {
        // Verifica se o clique foi no botão do menu ou dentro do menu
        const menu = document.getElementById('menu-lateral');
        if (event.target.id === 'menu-btn' || (menu && menu.contains(event.target))) {
            // Se o clique foi no botão do menu ou dentro do menu, não faz nada
            return;
        }

        // Se o clique foi fora do menu, fecha o menu
        setMenuAberto(false);
    };

    const addProjeto = async () => {
        const nome = nomeNovoProjeto;

        if (!nome) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        const data = {
            nome: nome,
        };

        const rotaEndpoint = 'Projeto/';
        const urlCompleta = urlBase + rotaEndpoint + nome;

        try {
            const response = await axios.post(urlCompleta, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // console.log(response.data);
            setIsModalOpen(false);
            setNomeNovoProjeto('');
            getProjetos();
        } catch (error) {
            console.error(error);
        }
    }

    const getProjetos = async () => {
        const rotaEndpoint = 'Projeto';
        const urlCompleta = urlBase + rotaEndpoint;

        try {
            const response = await axios.get(urlCompleta, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // console.log(response.data.data);
            setProjetos(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        window.addEventListener('click', fecharMenu);

        return () => {
            window.removeEventListener('click', fecharMenu);
        };
    }, []);



    const returnToLogin = () => {
        if (window.confirm('Tem certeza que deseja sair?')) {
            navigate('/login');
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

    const exibirDetalhesProjeto = async (id) => {
        let hasEtapas = await consultarEtapasProjeto(id);
        if (!hasEtapas) {
            localStorage.setItem('ProjetoId', id);
            navigate('/etapas-projeto');
        } else {
            localStorage.setItem('ProjetoId', id);
            navigate('/etapas-projeto');
        }
    }

    const verificarArrayVazio = (data) => {
        return Array.isArray(data) && data.length > 0;
    };

    const consultarEtapasProjeto = async (id) => {
        const rotaEndpoint = 'Projeto/' + id + "/etapas";
        const urlCompleta = urlBase + rotaEndpoint;

        try {
            const response = await axios.get(urlCompleta, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return verificarArrayVazio(response.data.data);
        } catch (error) {
            console.error("Ocorreu um erro na sua solicitação: ", error);
        }
    }

    const deleteProjeto = async (id) => {
        var rota = 'Projeto/' + id;
        var urlCompleta = urlBase + rota;

        // Adiciona uma caixa de confirmação
        if (window.confirm('Tem certeza que deseja excluir o projeto?')) {
            try {
                const response = await axios.delete(urlCompleta, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // console.log(response.data);
                getProjetos();
            } catch (error) {
                console.error(error);
            }
        } else {
            // O usuário clicou em "Cancelar", então não faz nada
            console.log('A exclusão foi cancelada pelo usuário.');
        }
    }

    const getValueToFixed = (value) => {
        if (value == null) {
            return 0;
        }

        const numberValue = parseFloat(value);
        return numberValue.toFixed(2);
    }

    return (
        <div id="home-page">
            <header id="header" className="bg-blue">
                <div className='header-content-right'>
                    <button id="menu-btn" onClick={() => setMenuAberto(!menuAberto)} className="open-menu-btn"></button>
                </div>
                <div className='header-content-left'>
                    <button onClick={returnToLogin} className="logout-btn"></button>
                </div>
            </header>

            {menuAberto && (
                <div id="menu-lateral">
                    <h1>Menu</h1>
                    <button onClick={goToDespesas} className="menu-btn">Despesas</button>
                    <button onClick={goToPretensoes} className="menu-btn">Pretensões</button>
                    <button onClick={goToHoraTecnica} className="menu-btn">Hora Técnica</button>
                </div>

            )}

            <div className='container-lista'>
                <main id="main-content">
                    <table className="projeto-table">
                        <thead className="projeto-thead">
                            <tr>
                                <th>Nome</th>
                                <th>Horas</th>
                                <th>Etapas</th>
                                <th>Atividades</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody className="projeto-tbody">
                            {projetos.length > 0 ? (
                                projetos.map(projeto => (
                                    <tr key={projeto.projetoId} className="projeto-row" onClick={() => exibirDetalhesProjeto(projeto.projetoId)}>
                                        <td className="cell-content">{projeto.nome}</td>
                                        <td className="cell-content">{getValueToFixed(projeto.quantidadeHoras)}</td>
                                        <td className="cell-content">{projeto.quantidadeEtapas}</td>
                                        <td className="cell-content">{projeto.quantidadeAtividades}</td>

                                        <td><button className='btn-remove' onClick={(event) => {
                                            event.stopPropagation(); // Isso impede que o evento de clique se propague para os elementos pais
                                            deleteProjeto(projeto.projetoId);
                                        }}>Remover</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className='not-found-text'>Comece Cadastrando seu Primeiro Projeto!</td>
                                </tr>
                            )}
                        </tbody>

                    </table>


                    <button className='novo-projeto-btn' id="novo-projeto-btn" onClick={openModal}>Novo Projeto</button>
                    {isModalOpen && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={closeModal}>×</span>
                                <div className="modal-header">
                                    Criar Projeto
                                </div>
                                <input type="text" placeholder="Dê um nome ao seu novo projeto" value={nomeNovoProjeto} onChange={handleProjectNameChange} />
                                <button className="novo-projeto-btn" onClick={addProjeto}>Criar</button>
                            </div>
                        </div>
                    )}

                </main>
            </div>

            <footer id="footer" className="bg-blue">
                <h1 id="footer-title">ArqTool</h1>
            </footer>
        </div>

    );
};

export default Home;
