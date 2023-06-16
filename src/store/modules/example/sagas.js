import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import * as actions from './actions';
import * as types from '../types';

const requisicao = () =>
  /* eslint-disable */
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });

function* exampleRequest() {
  try {
    yield call(requisicao);
    toast.success('Sucesso');
    yield put(actions.clicaBotaoSuccess());
  } catch (error) {
    toast.error('Deu erro');
    yield put(actions.clicaBotaoFailure());
  }
}

export default all([takeLatest(types.BOTAO_CLICADO_RESQUEST, exampleRequest)]);
