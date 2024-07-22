import { useLocation } from 'react-router-dom';
import React, { useDebugValue, useEffect, useState } from 'react';
import Message from '../Message/Message';
import LinkButton from '../LinkButton/LinkButton';
import Container from '../../layout/Container';
import styles from './Projetos.module.css';
import Card from './Card';
import Loading from '../Carregando/Carregando';

function Projetos() {
    const [projetos, setProjetos] = useState([]);
    const [removeLoading, setRemoveLoading] = useState(false)
    const [messageProjeto, setMessageProjeto] =useState('')

    const location = useLocation();
    let message = '';
    if (location.state && location.state.message) {
        message = location.state.message;
    }
    console.log('Location state:', location.state); // Log para verificar o estado de localização
    console.log('Message:', message); // Log para verificar a mensagem

    useEffect(() => {
        setTimeout(() => {
            fetch('http://localhost:5000/projects', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((resp) => resp.json())
            .then((data) => {
                console.log('Fetched projects:', data); // Log para verificar os dados recebidos
                setProjetos(data);
                setRemoveLoading(true);
            })
            .catch((err) => console.log(err));
        }, 300)
    }, []);


    function removeProjeto(id) {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProjetos(projetos.filter((projeto) => projeto.id !== id));
            setMessageProjeto('Projeto removido com sucesso');

        })
        .catch((err) => console.log(err))
    }

    return (
        <div className={styles.project_container}>
            <div className={styles.project_title}>
                <h1>Meus Projetos</h1>
                <LinkButton to='/newproject' text='Criar Projeto' />
            </div>
            {message && <Message type='success' msg={message} />}
            {messageProjeto && <Message type='success' msg={messageProjeto} />}
            <Container customClass='start'>
                {projetos.length > 0 ? (
                    projetos.map((projeto) => (
                        <Card
                            key={projeto.id}
                            id={projeto.id}
                            name={projeto.name}
                            budget={projeto.budget}
                            category={projeto.category ? projeto.category.name : 'Sem Categoria'}
                            handleRemove={removeProjeto}
                            
                        />
                    ))
                ) : (
                    <p>Sem projetos disponíveis</p>
                )}
                {!removeLoading && <Loading />}
                {removeLoading && projetos.length === 0 && (
                    <p>Não há projetos disponiveis!</p>
                )}
            </Container>
        </div>
    );
}

export default Projetos;
