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
  const { title, deadline } = request.body
  const { username } = request

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  username.todos.push(todo)

  return response.status(201).send()
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params
  const { title, deadline } = request.body
  const { username } = request

  const todo = username.todos.find(todo => todo.id === id)

  todo.title = title
  todo.deadline = new Date(deadline)

  return response.status(201).send(todo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;