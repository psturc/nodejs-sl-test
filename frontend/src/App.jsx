// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

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
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={addTodo} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add new todo..."
            className="flex-grow p-2 border rounded"
            data-testid="todo-input"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            data-testid="add-todo-button"
          >
            Add
          </button>
        </div>
      </form>

      <ul className="space-y-2">
        {todos.map(todo => (
          <li 
            key={todo._id}
            className="flex items-center justify-between p-2 border rounded"
            data-testid={`todo-item-${todo._id}`}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo._id)}
                className="h-4 w-4"
                data-testid={`todo-checkbox-${todo._id}`}
              />
              <span className={todo.completed ? 'line-through' : ''}>
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo._id)}
              className="text-red-500"
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