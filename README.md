# 📋 Task Manager

Aplicação web para gerenciamento de listas de tarefas, permitindo criar listas e adicionar tarefas com datas, descrições e status de conclusão.

Projeto desenvolvido com Laravel no back-end e React + Inertia no front-end.

--- 

## 🚀 Funcionalidades

- Criar listas de tarefas
- Editar listas
- Excluir listas
- Criar tarefas vinculadas a uma lista
- Marcar tarefas como concluídas
- Excluir tarefas
- Feedback visual de ações (mensagens de sucesso/erro)
- Interface moderna e responsiva

---

## 🛠️ Tecnologias Utilizadas

### Back-end

- PHP 8.2.12
- Laravel 12.50.0

### Front-end

- React 18
- Inertia.js
- Tailwind CSS
- Heroicons

---

## 📦 Instalação (Ambiente de Desenvolvimento)

Siga estes passos para configurar o projeto localmente.

### 1. Pré-requisitos

- PHP >= 8.2
- Composer
- Extensão PHP para `sqlite3`

### 2. Passos

1. Clone o repositório: `[https://github.com/davimart1ns/tasklist-laravel-react.git](https://github.com/davimart1ns/tasklist-laravel-react.git)`

2. Instale as dependências: `npm install`
3. Configure o `.env`: `cp .env.example .env`
4. Crie o arquivo do banco: `touch database/database.sqlite`
5. Rode as migrations e seeders: `php artisan migrate`
6. Inicie o servidor: `php artisan serve`
