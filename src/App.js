import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import logoCadastro from './assets/cadastro.png';

function App() {
  const baseUrl = "https://localhost:44340/api/Alunos";

  const [data, setData] = useState([]);
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [alunoSelecionado, setAlunoSelecionado] = useState({
    id: '',
    nome: '',
    email: '',
    idade: ''
  });

  const selecionarAluno = (aluno, opcao) => {
    setAlunoSelecionado(aluno);
    if (opcao === "Editar") abrirFecharModalEditar();
    if (opcao === "Excluir") abrirFecharModalExcluir();
  };

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  };

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirFecharModalExcluir = () => {
    setModalExcluir(!modalExcluir);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setAlunoSelecionado({
      ...alunoSelecionado, [name]: value
    });
  };

  const pedidoGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      });
  };

  const pedidoPost = async () => {
    const alunoParaPost = { ...alunoSelecionado };
    delete alunoParaPost.id;
    alunoParaPost.idade = parseInt(alunoParaPost.idade);
    await axios.post(baseUrl, alunoParaPost)
      .then(response => {
        setData([...data, response.data]);
        abrirFecharModalIncluir();
      }).catch(error => {
        console.log(error);
      });
  };

  const pedidoPut = async () => {
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);
    await axios.put(baseUrl + "/" + alunoSelecionado.id, alunoSelecionado)
      .then(response => {
        const dadosAuxiliar = data.map(aluno => {
          if (aluno.id === alunoSelecionado.id) {
            return { ...aluno, ...alunoSelecionado };
          }
          return aluno;
        });
        setData(dadosAuxiliar);
        abrirFecharModalEditar();
      }).catch(error => {
        console.log(error);
      });
  };

  const pedidoDelete = async () => {
    await axios.delete(baseUrl + "/" + alunoSelecionado.id)
      .then(response => {
        setData(data.filter(aluno => aluno.id !== alunoSelecionado.id));
        abrirFecharModalExcluir();
      }).catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    pedidoGet();
  }, []);

  return (
    <div className="aluno-container">
      <br />
      <h3>Cadastro de Alunos</h3>
      <header>
        <img src={logoCadastro} alt='Cadastro' />
        <button className="btn btn-success" onClick={abrirFecharModalIncluir}>Incluir Novo Aluno</button>
      </header>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map((aluno) => {
            return (
              <tr key={aluno.id}>
                <td>{aluno.id}</td>
                <td>{aluno.nome}</td>
                <td>{aluno.email}</td>
                <td>{aluno.idade}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => selecionarAluno(aluno, "Editar")}>Editar</button>
                  <button className="btn btn-danger" onClick={() => selecionarAluno(aluno, "Excluir")}>Excluir</button>
                </td>
              </tr>)
          })}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Alunos</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome: </label>
            <br />
            <input type="text" className="form-control" name="nome" onChange={handleChange} />
            <br />
            <label>Email: </label>
            <br />
            <input type="text" className="form-control" name="email" onChange={handleChange} />
            <br />
            <label>Idade: </label>
            <br />
            <input type="text" className="form-control" name="idade" onChange={handleChange} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={pedidoPost} >Incluir</button>{" "}
          <button className="btn btn-danger" onClick={abrirFecharModalIncluir} >Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Alunos</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID: </label>
            <input type="text" className="form-control" readOnly value={alunoSelecionado && alunoSelecionado.id} />
            <br />
            <label>Nome: </label>
            <br />
            <input type="text" className="form-control" name="nome" onChange={handleChange} value={alunoSelecionado && alunoSelecionado.nome} />
            <br />
            <label>Email: </label>
            <br />
            <input type="text" className="form-control" name="email" onChange={handleChange} value={alunoSelecionado && alunoSelecionado.email} />
            <br />
            <label>Idade: </label>
            <br />
            <input type="text" className="form-control" name="idade" onChange={handleChange} value={alunoSelecionado && alunoSelecionado.idade} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={pedidoPut}>Editar</button>{" "}
          <button className="btn btn-danger" onClick={abrirFecharModalEditar}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirma a exclusão deste(a) aluno(a): {alunoSelecionado && alunoSelecionado.nome}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={pedidoDelete}>Sim</button>
          <button className="btn btn-secondary" onClick={abrirFecharModalExcluir}>Não</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
