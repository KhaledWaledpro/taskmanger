class TaskManager {
            constructor() {
                this.tasks = [];
                this.currentFilter = 'all';
                this.editingTaskId = null;
                this.init();
            }

            init() {
                this.bindEvents();
                this.render();
            }

            bindEvents() {
                document.getElementById('addTaskForm').addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.addTask();
                });

                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        this.setFilter(e.target.dataset.filter);
                    });
                });

                document.getElementById('taskList').addEventListener('click', (e) => {
                    const taskId = parseInt(e.target.closest('.task-item')?.dataset.taskId);
                    if (!taskId) return;

                    if (e.target.classList.contains('task-checkbox')) {
                        this.toggleTask(taskId);
                    } else if (e.target.classList.contains('delete-btn')) {
                        this.deleteTask(taskId);
                    } else if (e.target.classList.contains('edit-btn')) {
                        this.editTask(taskId);
                    }
                });

                document.getElementById('taskList').addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && e.target.classList.contains('editing')) {
                        this.saveEdit(parseInt(e.target.closest('.task-item').dataset.taskId));
                    }
                });

                document.getElementById('taskList').addEventListener('blur', (e) => {
                    if (e.target.classList.contains('editing')) {
                        this.saveEdit(parseInt(e.target.closest('.task-item').dataset.taskId));
                    }
                }, true);
            }

            addTask() {
                const input = document.getElementById('taskInput');
                const text = input.value.trim();
                
                if (text) {
                    const task = {
                        id: Date.now(),
                        text: text,
                        completed: false,
                        createdAt: new Date()
                    };
                    
                    this.tasks.unshift(task);
                    input.value = '';
                    this.render();
                }
            }

            toggleTask(id) {
                const task = this.tasks.find(t => t.id === id);
                if (task) {
                    task.completed = !task.completed;
                    this.render();
                }
            }

            deleteTask(id) {
                this.tasks = this.tasks.filter(t => t.id !== id);
                this.render();
            }

            editTask(id) {
                const taskElement = document.querySelector(`[data-task-id="${id}"] .task-text`);
                const task = this.tasks.find(t => t.id === id);
                
                if (taskElement && task) {
                    taskElement.contentEditable = true;
                    taskElement.classList.add('editing');
                    taskElement.focus();
                    this.editingTaskId = id;
                    
                    // Select all text
                    const range = document.createRange();
                    range.selectNodeContents(taskElement);
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }

            saveEdit(id) {
                const taskElement = document.querySelector(`[data-task-id="${id}"] .task-text`);
                const task = this.tasks.find(t => t.id === id);
                
                if (taskElement && task) {
                    const newText = taskElement.textContent.trim();
                    if (newText) {
                        task.text = newText;
                    }
                    
                    taskElement.contentEditable = false;
                    taskElement.classList.remove('editing');
                    this.editingTaskId = null;
                    this.render();
                }
            }

            setFilter(filter) {
                this.currentFilter = filter;
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.filter === filter);
                });
                this.render();
            }

            getFilteredTasks() {
                switch (this.currentFilter) {
                    case 'completed':
                        return this.tasks.filter(t => t.completed);
                    case 'pending':
                        return this.tasks.filter(t => !t.completed);
                    default:
                        return this.tasks;
                }
            }

            updateStats() {
                const total = this.tasks.length;
                const completed = this.tasks.filter(t => t.completed).length;
                const pending = total - completed;

                document.getElementById('totalTasks').textContent = total;
                document.getElementById('completedTasks').textContent = completed;
                document.getElementById('pendingTasks').textContent = pending;
            }

            render() {
                const taskList = document.getElementById('taskList');
                const filteredTasks = this.getFilteredTasks();
                
                this.updateStats();

                if (filteredTasks.length === 0) {
                    const emptyMessage = this.currentFilter === 'completed' ? 
                        'No completed tasks yet. Complete some tasks to see them here! ✅' :
                        this.currentFilter === 'pending' ?
                        'No pending tasks! You\'re all caught up! 🎉' :
                        'No tasks yet. Add one above to get started! 🚀';
                        
                    taskList.innerHTML = `<div class="empty-state"><p>${emptyMessage}</p></div>`;
                    return;
                }

                taskList.innerHTML = filteredTasks.map(task => `
                    <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                        <div class="task-checkbox ${task.completed ? 'checked' : ''}"></div>
                        <div class="task-text ${task.completed ? 'completed' : ''}">${task.text}</div>
                        <div class="task-actions">
                            <button class="edit-btn">Edit</button>
                            <button class="delete-btn">Delete</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Initialize the task manager
        new TaskManager();