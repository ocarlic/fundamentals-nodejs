const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const checkUsername = users.find(user => user.username === username)

  if(!checkUsername) {
    return response.status(400).json({ error: 'User not found' })
  }

  request.username = checkUsername
  
  return next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body

  const userAlreadyExist = users.some(user => user.username === username)

  if(userAlreadyExist) {
    return response.status(400).json({ error: 'User already exists!' })
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  })

  return response.status(201).json(users)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request

  return response.json(username.todos)  
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;