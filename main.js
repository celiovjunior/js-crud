'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields();
    document.getElementById('modal').classList.remove('active');
}

// const tempClient = {
//     nome: "Rodrigo",
//     email: "rod@email.com",
//     celular: "85 9 98765432",
//     cidade: "Recife"
// }

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

// DELETE
const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
}

// UPDATE
const updateClient = (index, client) => {
    const dbClient = readClient();
    dbClient[index] = client;
    setLocalStorage(dbClient);
}

// READ
const readClient = () => getLocalStorage()

// CREATE
const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push(client)
    setLocalStorage(dbClient)
}

// Validando campos do formulario
const isValidFields = () => {
    return document.getElementById('form').reportValidity();
}

// Interacao com o front
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = "");
}

const saveClient = () => {
    if(isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value,
        }
        const index = document.getElementById('nome').dataset.index;
        if(index == 'new') {
            createClient(client);
            updateTable();            
            closeModal();
        } else {
            updateClient(index, client);
            updateTable();
            closeModal();
        }
    }
}

// Setando um novo cliente na table do front
const createRow = (client, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
    <td>${client.nome}</td>
    <td>${client.email}</td>
    <td>${client.celular}</td>
    <td>${client.cidade}</td>
    <td>
        <button type="button" class="button green" data-action='edit-${index}'>Editar</button>
        <button type="button" class="button red" data-action='delete-${index}'>Excluir</button>
    </td>
    `

    document.querySelector('#tableClient>tbody').appendChild(newRow);
};

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient();
    clearTable();
    dbClient.forEach(createRow);
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome;
    document.getElementById('email').value = client.email;
    document.getElementById('celular').value = client.celular;
    document.getElementById('cidade').value = client.cidade;
    document.getElementById('nome').dataset.index = client.index;
}

const editSingleClient = (index) => {
    const client = readClient()[index];
    client.index = index;

    fillFields(client);
    openModal()
}

const editDelete = (event) => {
    if(event.target.type == 'button') {
        const [action, index] = event.target.dataset.action.split('-');
        
        if(action == 'edit') {
            editSingleClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Tem certeza que deseja EXCLUIR o cliente ${client.nome}`)
            if(response) {
                deleteClient(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal);

document.getElementById('modalClose')
    .addEventListener('click', closeModal);

document.getElementById('salvar')
    .addEventListener('click', saveClient);

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)