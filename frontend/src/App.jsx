import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
    } catch (err) {
      setError('Failed to fetch todos');
    }
  };

  function test() {
    console.log("test")
  }

  const addTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/todos`, { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t._id === id);
      await axios.put(`${API_URL}/todos/${id}`, {
        completed: !todo.completed
      });
      setTodos(todos.map(t => 
        t._id === id ? { ...t, completed: !t.completed } : t
      ));
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      {error && ( <div>{error}</div> )}

      <form onSubmit={addTodo} >
        <div >
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add new todo..."
            data-testid="todo-input"
          />
          <button type="submit" data-testid="add-todo-button"> Add </button>
        </div>
      </form>

      <ul>
        {todos.map(todo => (
          <li key={todo._id} data-testid={`todo-item-${todo._id}`}>
            <div>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo._id)}
                data-testid={`todo-checkbox-${todo._id}`}
              />
              <span className={todo.completed ? 'line-through' : ''}>
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo._id)}
              data-testid={`delete-todo-${todo._id}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;