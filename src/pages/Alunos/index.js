import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { FaUserCircle, FaExclamation } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Container } from '../../styles/GlobalStyles';
import {
  AlunoContainer,
  ProfilePicture,
  StyledFaEdit,
  StyledFaWindowClose,
} from './styled';
import axios from '../../services/axios';
import Loading from '../../components/Loading';

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get('/alunos');
      setAlunos(response.data);
      setIsLoading(false);
    }

    getData();
  }, []);

  async function handleDeleteAsk(e) {
    e.preventDefault();
    const exclamation = e.currentTarget.nextSibling;
    exclamation.setAttribute('display', 'block');
    e.currentTarget.remove();
  }

  const handleDelete = async (e, id, index) => {
    e.persist();
    try {
      setIsLoading(true);
      await axios.delete(`/alunos/${id}`);
      const novosAlunos = [...alunos];
      novosAlunos.splice(index, 1);
      setAlunos(novosAlunos);
      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.status', 0);

      if (status === 401) {
        toast.error('Você precisa fazer login');
      } else {
        toast.error('Ocorreu um erro ao excluir aluno');
      }
      setIsLoading(false);
    }
  };

  /* eslint-disable */
  console.log(alunos);

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1>Alunos</h1>
      <AlunoContainer>
        {alunos.length > 0
          ? alunos.map((aluno, index) => (
              <div key={String(aluno.id)}>
                <ProfilePicture>
                  {get(aluno, 'Fotos[0].url', false) ? (
                    <img src={aluno.Fotos[0].url} alt="" />
                  ) : (
                    <FaUserCircle size={36} />
                  )}
                </ProfilePicture>

                <span>{aluno.nome}</span>
                <span>{aluno.email}</span>

                <Link to={`/aluno/${aluno.id}/edit`}>
                  <StyledFaEdit size={24} />
                </Link>

                <Link
                  onClick={(e) => handleDeleteAsk(e)}
                  to={`/aluno/${aluno.id}/delete`}
                >
                  <StyledFaWindowClose size={24} />
                </Link>

                <FaExclamation
                  onClick={(e) => handleDelete(e, aluno.id, index)}
                  size={16}
                  display="none"
                  cursor="pointer"
                />
              </div>
            ))
          : 'Não existe alunos'}
      </AlunoContainer>
    </Container>
  );
}
