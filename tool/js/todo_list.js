'use strict';
{
  const todoList = document.getElementById('todoList');

  // --------------------------------------------------
  // Todoの追加
  // --------------------------------------------------
  function addTodo() {
    // 未入力は無効
    const todoInput = document.getElementById('todoInput');
    if (todoInput.value.trim() === '') return;

    createTodoItem(todoInput.value.trim(), false);
    todoInput.value = '';
    saveTodos();
  }

  // --------------------------------------------------
  // Todoリストの行を作成して追加
  // --------------------------------------------------
  function createTodoItem(text, checked) {
    // チェックボックス
    const todoCheck = document.createElement('input');
    todoCheck.type = 'checkbox';
    todoCheck.classList.add('todo-check');
    todoCheck.checked = checked;
    // チェックボックスが変更されたら状態を保存する
    todoCheck.addEventListener('change', saveTodos);
    // 本文
    const todoText = document.createElement('span');
    todoText.classList.add('todo-text');
    todoText.textContent = text;
    // 削除ボタン
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('todo-delete');
    deleteButton.textContent = 'Delete';
    // 削除ボタンが押されたら対象のliタグを削除する
    deleteButton.addEventListener('click', () => {
      todoList.removeChild(li);
      saveTodos();
    });
    // liタグ内に配置しリストに追加
    const li = document.createElement('li');
    li.appendChild(todoCheck);
    li.appendChild(todoText);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
  }

  // --------------------------------------------------
  // Todoリストをローカルストレージに保存
  // --------------------------------------------------
  function saveTodos() {
    const todos = [];
    document.querySelectorAll('#todoList li').forEach(li => {
      const checkbox = li.querySelector('.todo-check');
      const text = li.querySelector('.todo-text').textContent;

      todos.push({
        text: text,
        checked: checkbox.checked
      });
    });
    localStorage.setItem('kuma-kosaku_todo', JSON.stringify(todos));
  }

  // --------------------------------------------------
  // ローカルストレージから画面表示リスト作成
  // --------------------------------------------------
  function loadTodos() {
    const data = JSON.parse(localStorage.getItem('kuma-kosaku_todo')) || [];
    data.forEach(item => {
      createTodoItem(item.text, item.checked);
    });
  }

  document.getElementById('addTodo').addEventListener('click', addTodo);
  document.addEventListener('DOMContentLoaded', loadTodos);
}