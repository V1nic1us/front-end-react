import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { isEmail, isInt, isFloat } from 'validator';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import Loading from '../../components/Loading';
import axios from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions';

/* eslint-disable */

export default function Aluno({ match }) {
  const id = get(match, 'params.id', 0);
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [idade, setIdade] = useState('');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) return;

    async function getData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/alunos/${id}`);
        const Foto = get(data, 'Fotos[0].url', '');

        setNome(data.nome);
        setSobrenome(data.sobrenome);
        setEmail(data.email);
        setIdade(data.idade);
        setPeso(data.peso);
        setAltura(data.altura);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        const status = get(error, 'response.status', 0);
        const errors = get(error, 'responser.data.erros', []);

        if (status === 400) errors.map((element) => toast.error(element));
        history.push('/');
      }
    }

    getData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErros = false;

    if (nome.length < 3 || nome.length > 255) {
      toast.error('Digite um nome entre 3 e 255');
      formErros = true;
    }

    if (sobrenome.length < 3 || sobrenome.length > 255) {
      toast.error('Digite um nome entre 3 e 255');
      formErros = true;
    }

    if (!isEmail(email)) {
      toast.error('Este email não é valido');
      formErros = true;
    }

    if (!isInt(String(idade))) {
      toast.error('Idade Inválida');
      formErros = true;
    }

    if (!isFloat(String(altura))) {
      toast.error('Altura Inválida');
      formErros = true;
    }
    if (!isFloat(String(peso))) {
      toast.error('Peso Inválida');
      formErros = true;
    }

    if (formErros) return;

    try {
      setIsLoading(true);

      if (id) {
        await axios.put(`/alunos/${id}`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });
        setIsLoading(false);
        toast.success('Aluno(a) editado(a) com sucesso!');
      } else {
        const { data } = await axios.post(`/alunos/`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });
        setIsLoading(false);
        toast.success('Aluno(a) criado(a) com sucesso!');
        history.push(`/aluno/${data.id}/edit`);
      }
    } catch (error) {
      const status = get(error, 'response.status', 0);
      const data = get(error, 'response.data', {});
      const errors = get(data, 'errors', []);

      if (errors.length > 0) {
        errors.map((element) => toast.error(element));
      } else {
        toast.error('Erro desconhecido');
      }

      if (status === 401) dispatch(actions.loginFailure());
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1>{id ? 'Editar aluno' : 'Novo aluno'}</h1>
      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => setNome(e.target.value)}
          placeholder="nome"
          value={nome}
        />
        <input
          type="text"
          onChange={(e) => setSobrenome(e.target.value)}
          placeholder="sobrenome"
          value={sobrenome}
        />
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          value={email}
        />
        <input
          type="number"
          onChange={(e) => setIdade(e.target.value)}
          placeholder="idade"
          value={idade}
        />
        <input
          type="text"
          onChange={(e) => setAltura(e.target.value)}
          placeholder="altura"
          value={altura}
        />
        <input
          type="text"
          onChange={(e) => setPeso(e.target.value)}
          placeholder="peso"
          value={peso}
        />

        <button type="submit">Enviar</button>
      </Form>
    </Container>
  );
}

Aluno.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
