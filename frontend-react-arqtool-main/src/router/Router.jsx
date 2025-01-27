import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginRegistro from "../pages/LoginRegistro/LoginRegistro.jsx"
import Despesas from "../pages/Despesas/Despesas.jsx";
import ResultadoHoraTecnica from "../pages/ResultadoHoraTecnica/ResultadoHoraTecnica.jsx";
import CalcularHoraTecnica from "../pages/CalcularHoraTecnica/CalcularHoraTecnica.jsx";
import Home from "../pages/Home/Home.jsx";
import CadastrarEtapasProjeto from "../pages/CadastrarEtapasProjeto/CadastrarEtapasProjeto.jsx";
import CalcularProjeto from "../pages/CalcularProjeto/CalcularProjeto.jsx";

// Cria um contexto para armazenar a função de navegação
const NavigateContext = createContext();

// Componente que fornece o valor do contexto
const NavigateProvider = ({ children }) => {
  const navigate = useNavigate();

  return (
    <NavigateContext.Provider value={navigate}>
      {children}
    </NavigateContext.Provider>
  );
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expiration');
  localStorage.removeItem('userId');
}

const setUrlBaseApiOnLocalStorage = () => {
  const urlLocal = 'https://localhost:7177/api/';
  const urlHospedagem = 'https://caiobadev-api-arqtool.azurewebsites.net/api/';

  localStorage.setItem('urlBase', urlLocal);
}

const AuthenticationHandler = () => {
  const navigate = useContext(NavigateContext); // Usa o contexto para obter a função de navegação

  async function handleAuthentication() {
    var dataExpiracao = localStorage.getItem('expiration');

    if (dataExpiracao) {
      var expiracaoDate = new Date(dataExpiracao);
      var currentDate = new Date();

      if (expiracaoDate < currentDate) {
        logout();
        navigate('/login');
      } else {
        console.log("O token ainda é válido");
      }
    } else {
      navigate('/login');
    }
  }

  useEffect(() => {
    handleAuthentication();

    const intervalId = setInterval(() => {
      handleAuthentication();
    }, 60000); // 1 minutos em milissegundos

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    setUrlBaseApiOnLocalStorage();
  }, []);

}

const AppRouter = () => {
  return (
    <Router>
      <NavigateProvider>
        <AuthenticationHandler />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginRegistro />} />
          <Route path="/despesas" element={<Despesas />} />
          <Route path="/hora-tecnica" element={<ResultadoHoraTecnica />} />
          <Route path="/valor-hora" element={<CalcularHoraTecnica />} /> 
          <Route path="/home" element={<Home/>} />      
          <Route path="/etapas-projeto" element={<CadastrarEtapasProjeto/>} />  
          <Route path="/projeto" element={<CalcularProjeto/>} />
        </Routes>
      </NavigateProvider>
    </Router>
  );
}

export default AppRouter;
