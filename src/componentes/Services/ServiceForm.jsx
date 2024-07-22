import Input from "../Forms/Input"
import SubmitButton from "../Forms/SubmitButton"
import { useState } from "react"

function ServiceForm({handleSubmit, btnText, projectData}) {
    const [service, setService] = useState({})

    function submit(e) {
        e.preventDefault()
        projectData.services.push(service)
        handleSubmit(projectData)
    }

    function handleChange(e) {
        setService({ ...service, [e.target.name]: e.target.value })

    }

    return(
        <form onSubmit={submit}>
            <Input
            type='text'
            text='Nome do serviço'
            name='name'
            placeholder='Insira o nome do serviço'
            handleOnChange={handleChange} 
            />
        
            <Input
            type='number'
            text='Orçamento do serviço'
            name='cost'
            placeholder='Insira o valor do serviço'
            handleOnChange={handleChange}
            />
            <Input
            type='text'
            text='Descrição do serviço'
            name='description'
            placeholder='Descreva o serviço'
            handleOnChange={handleChange}
            />
            <SubmitButton text={btnText} />
        </form>
    )

}

export default ServiceForm