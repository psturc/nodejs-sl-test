const { expect } = require('chai');
const puppeteer = require('puppeteer');
const axios = require('axios');

let api;

describe('Todo App E2E Tests', function() {
  let browser;
  let page;
  const backendURL = process.env.BACKEND_URL || 'http://0.0.0.0:3001';
  const frontendURL = process.env.FRONTEND_URL || 'http://0.0.0.0:3000';
  
  before(async function() {
    this.timeout(10000);

    api = axios.create({
      baseURL: backendURL,
    });

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });
    page = await browser.newPage();
  });

  afterEach(async function() {
    await cleanup();
  });

  after(async function() {
    await browser.close();
  });

  describe('Backend API', function() {
    it('should create a new todo', async function() {
      const response = await api.post('/todos', { text: 'Test todo' });

      expect(response.status).to.equal(201);
      expect(response.data).to.have.property('text', 'Test todo');
      expect(response.data).to.have.property('completed', false);
    });

    it('should get all todos', async function() {
           await api
        .post('/todos',{ text: 'Test todo' });

      const response = await api.get('/todos');
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an('array');
      expect(response.data).to.have.lengthOf(1);
    });

    it('should update todo completion status', async function() {
           const createResponse = await api
        .post('/todos',{ text: 'Test todo' });

      const updateResponse = await api
        .put(`/todos/${createResponse.data._id}`,{ completed: true });

      expect(updateResponse.status).to.equal(200);
      expect(updateResponse.data.completed).to.be.true;
    });

    it('should delete a todo', async function() {
           const createResponse = await api
        .post('/todos',{ text: 'Test todo' });

      const deleteResponse = await api
        .delete(`/todos/${createResponse.data._id}`);

      expect(deleteResponse.status).to.equal(204);

           const getResponse = await api.get('/todos');
      expect(getResponse.data).to.have.lengthOf(0);
    });
  });

   describe('Frontend Integration', function() {
    this.timeout(40000);

    it('should add a new todo through UI', async function() {
      await page.goto(frontendURL);
      
           await page.type('[data-testid="todo-input"]', 'New Todo Item');
      await page.click('[data-testid="add-todo-button"]');

           await page.waitForSelector('[data-testid^="todo-item-"]');
      
           const todoText = await page.$eval('[data-testid^="todo-item-"]', el => el.textContent);
      expect(todoText).to.include('New Todo Item');
    });

    it('should toggle todo completion', async function() {
        
      await page.goto(frontendURL);
      
           await page.type('[data-testid="todo-input"]', 'Toggle Todo');
      await page.click('[data-testid="add-todo-button"]');
      
           await page.waitForSelector('[data-testid^="todo-checkbox-"]');
      await page.click('[data-testid^="todo-checkbox-"]');

      await delay(100);

           const hasStrike = await page.$eval('[data-testid^="todo-item-"]', 
        el => el.querySelector('span').classList.contains('line-through')
      );
      expect(hasStrike).to.be.true;
    });

    it('should delete a todo', async function() {
      await page.goto(frontendURL);
      
           await page.type('[data-testid="todo-input"]', 'Delete Todo');
      await page.click('[data-testid="add-todo-button"]');
      
           await page.waitForSelector('[data-testid^="delete-todo-"]');
      
           const initialTodos = await page.$$('[data-testid^="todo-item-"]');
      
           await page.click('[data-testid^="delete-todo-"]');
      
           await page.waitForFunction(
        (initialCount) => {
          const todos = document.querySelectorAll('[data-testid^="todo-item-"]');
          return todos.length === initialCount - 1;
        },
        {},
        initialTodos.length
      );
      
      const remainingTodos = await page.$$('[data-testid^="todo-item-"]');
      expect(remainingTodos.length).to.equal(initialTodos.length - 1);
    });
  });
});

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

async function cleanup() {
  const response = await api.delete('/todos');
  expect(response.status).to.equal(204);
}