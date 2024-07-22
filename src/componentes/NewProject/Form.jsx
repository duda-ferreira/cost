import { useEffect, useState } from 'react';
import styles from './Form.module.css';
import Input from '../Forms/Input';
import Select from '../Forms/Select';
import SubmitButton from '../Forms/SubmitButton';

function Form({ handleSubmit, btnText, projectData }) {
    const [project, setProject] = useState(projectData || {
        name: '',
        budget: '',
        category: {
            id: '',
            name: ''
        }
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/categories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((resp) => resp.json())
        .then((data) => {
            setCategories(data);
        })
        .catch((err) => console.log(err));
    }, []);

    const submit = (e) => {
        e.preventDefault();
        handleSubmit(project);
    };

    function handleChange(e) {
        setProject({ ...project, [e.target.name]: e.target.value });
    }

    function handleCategory(e) {
        setProject({
            ...project,
            category: {
                id: e.target.value,
                name: e.target.options[e.target.selectedIndex].text
            }
        });
    }

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input
                type='text'
                text='Nome do Projeto'
                name='name'
                placeholder='Insira o nome do projeto'
                handleOnChange={handleChange}
                value={project.name || ''}
            />
            <div>
                <Input
                    type='number'
                    text='Orçamento do Projeto'
                    name='budget'
                    placeholder='Insira o orçamento total'
                    handleOnChange={handleChange}
                    value={project.budget || ''}
                />
            </div>
            <div>
                <Select
                    name='category_id'
                    text='Selecione a categoria'
                    options={categories}
                    handleOnChange={handleCategory}
                    value={project.category.id || ''}
                />
            </div>
            <div>
                <SubmitButton text={btnText} />
            </div>
        </form>
    );
}

export default Form;
