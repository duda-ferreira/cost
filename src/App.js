import React from 'react';
import Navbar from './componentes/Navbar/Navbar';
import Home from './componentes/Home/Home';
import Company from './componentes/Company/Company';
import Contato from './componentes/Contato/Contato';
import Projetos from './componentes/Projetos/Projetos';
import Footer from './componentes/Footer/Footer';
import NewProject from './componentes/NewProject/NewProject';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Container from './layout/Container';
import Projeto from './componentes/Projetos/Projeto';

function App() {
  return (
    <Router>
      <Navbar />
      <Container customClass='min-height'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/projects' element={<Projetos />} />
        <Route path="/company" element={<Company />} />
        <Route path="/contact" element={<Contato />} />
        <Route path="/newproject" element={<NewProject />} />
        <Route path="/project/:id" element={<Projeto />} />
      </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
