import {parse, v4 as uuidv4} from 'uuid';

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import styles from './Projeto.module.css';
import Loading from "../Carregando/Carregando";
import Container from "../../layout/Container";
import Form from "../NewProject/Form";
import Message from "../Message/Message";
import ServiceForm from "../Services/ServiceForm";
import Card from '../Services/Card'

function Projeto() {
    const {id}  = useParams();
    const [projeto, setProjeto] = useState({});
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [message, setMessage] = useState();
    const [type, setType] = useState();
    const [showServiceForm, setShowServiceForm] = useState();
    const [services, setServices] = useState({})

    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((resp) => resp.json())
            .then((data) => {
                setProjeto(data)
                setServices(data.services)
            })
            .catch((err) => console.log(err))
        }, 500)
    }, [id])

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
    }

    function editPost(projeto) {
        setMessage('')
        //budget validation
        if(projeto.budget < projeto.cost) {
            setMessage('O orçamento não pode ser menor que o custo do projeto!')
            setType('error')
            return false
        }

        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projeto),
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProjeto(data)
            setShowProjectForm(false)
            setMessage('Projeto atualizado com sucesso')
            setType('success')
        })
        .catch((err) => console.log(err))
    }

    function createService(project) {
        // last service
        const lastService = project.services[project.services.length - 1]
    
        lastService.id = uuidv4()
    
        const lastServiceCost = lastService.cost
    
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)
    
        // maximum value validation
        if (newCost > parseFloat(project.budget)) {
          setMessage('Orçamento ultrapassado, verifique o valor do serviço!')
          setType('error')
          project.services.pop()
          return false
        }
    
        // add service cost to project cost total
        project.cost = newCost
    
        fetch(`http://localhost:5000/projects/${project.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(project),
        })
          .then((resp) => resp.json())
          .then((data) => {
            setServices(data.services)
            setShowServiceForm(!showServiceForm)
            setMessage('Serviço adicionado!')
            setType('success')
          })
      }

      function removeService(id, cost) {
        const servicesUpdated = projeto.services.filter(
            (service) => service.id !== id
        )

        const projetoUpdated = projeto

        projetoUpdated.services = servicesUpdated
        projetoUpdated.cost = parseFloat(projetoUpdated.cost) - parseFloat(cost)

        fetch(`http://localhost:5000/projects/${projetoUpdated.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projetoUpdated)
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProjeto(projetoUpdated)
            setServices(servicesUpdated)
            setMessage('Serviço removido com sucesso')
            setType('success')
        })
        .catch((err) => console.log(err))

      }
    

    return(
        <>
            {projeto.name ? (
            <div className={styles.project_details}>
                <Container customClass='column'>
                    {message && <Message type={type} msg={message} />}
                    <div className={styles.details_container}>
                        <h1>Projeto: {projeto.name}</h1>
                        <button className={styles.btn} onClick={toggleProjectForm}>
                        {showProjectForm ? 'Fechar' : 'Editar projeto'}
                        </button>
                        {!showProjectForm ? (
                            <div className={styles.project_info}>
                                <p>
                                    <span>Categoria:</span> {projeto.category.name}
                                </p>
                                <p>
                                    <span>Total de Orçamento:</span> R${projeto.budget}
                                </p>
                                <p>
                                    <span>Total utilizado:</span> R${projeto.cost}
                                </p>
                            </div>

                        ) : (
                            <div className={styles.project_info}>
                                <Form
                                handleSubmit={editPost} btnText={'Concluir edição'} projectData={projeto} />
                            </div>
                        )}
                    </div>
                    <div className={styles.service_form_container}>
                        <h2>Adicione um serviço:</h2>
                        <button className={styles.btn} onClick={toggleServiceForm}>
                            {showServiceForm ? 'Fechar' : 'Adicionar serviço'}
                        </button>
                        <div className={styles.project_info}>
                            {showServiceForm &&
                             <ServiceForm 
                             handleSubmit={createService}
                             btnText='Adicionar serviço'
                             projectData={projeto}/>}
                        </div>
                    </div>
                    <h2>Serviços:</h2>
                    <Container customClass='start'></Container>
                        {services.length > 0 && 
                            services.map((service) => (
                                <Card
                                    id={service.id}
                                    key={service.id}
                                    name={service.name}
                                    cost={service.cost}
                                    description={service.description}
                                    handleRemove={removeService}
                                />
                            ))
                        
                        }


                        {services.length === 0 && <p>Não há serviços cadastrados</p>}
                </Container>
            </div> ) 
              : ( <Loading />
            )}
        </>
    )
}

export default Projeto;