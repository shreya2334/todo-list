const todoForm = document.querySelector('#todo-form')
const todoList = document.querySelector('.todos')
const totalTasks = document.querySelector('#total-tasks')
const completeTasks = document.querySelector('#completed-tasks')
const remainingTasks = document.querySelector('#remaining-tasks')
const mainInput = document.querySelector('#todo-form input')
const emptyState = document.querySelector('.empty-state')

let tasks = JSON.parse(localStorage.getItem('tasks')) ||  []

tasks.forEach(task => {
    const taskEl = createTask(task)
    todoList.appendChild(taskEl)
})

countTasks()

todoForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const inputValue = mainInput.value

    if(!inputValue.trim()){
        return
    }

    const task = {
        id: new Date().getTime(),
        name: inputValue,
        isCompleted: false
    }

    tasks.push(task)
    localStorage.setItem('tasks', JSON.stringify(tasks))
    console.log("Saved:", tasks);

    const taskEl = createTask(task)
    todoList.appendChild(taskEl)

    countTasks()
    
    todoForm.reset()
    mainInput.focus()
})

todoList.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.remove-task');

    if (deleteBtn) {
        const taskId = deleteBtn.closest('li').id;
        removeTask(taskId);
    }
});

todoList.addEventListener('change', (e) => {
    if(e.target.type === 'checkbox'){
        const taskId = e.target.closest('li').id
        updateTask(taskId, e.target)
    }
})

todoList.addEventListener('input', (e) => {
    if(e.target.hasAttribute('contenteditable')){
        const taskId = e.target.closest('li').id
        updateTask(taskId, e.target)
    }
})

todoList.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
        e.preventDefault()

        e.target.blur()
    }
})
function createTask(task){
    const taskEl = document.createElement('li')

    taskEl.setAttribute('id', task.id)

    if(task.isCompleted){
        taskEl.classList.add('completed')
    }

    taskEl.innerHTML = `
    <div>
        <input type="checkbox" name="tasks" id="${task.id}" ${task.isCompleted ? 'checked' : ''}>
        <span ${!task.isCompleted ? 'contenteditable' : ''}>${task.name}</span>
    </div>
    
    <button title="Remove the ${task.name} task" class="remove-task">
        <i class="fa-solid fa-trash"></i>
    </button>`;

    return taskEl
}

function countTasks(){
    const completedTasksArray = tasks.filter(task => task.isCompleted)

    totalTasks.textContent = tasks.length
    completeTasks.textContent = completedTasksArray.length
    remainingTasks.textContent = tasks.length - completedTasksArray.length

    if(tasks.length === 0){
        emptyState.style.display = 'block'
    } else {
        emptyState.style.display = 'none'
    }
}

function removeTask(taskId){
   tasks = tasks.filter(task => task.id !== parseInt(taskId))

    localStorage.setItem('tasks', JSON.stringify(tasks))

    document.getElementById(taskId).remove()

    countTasks()
}

function updateTask(taskId, el){
    const task = tasks.find((task) => task.id === parseInt(taskId))
    if(!task) return

    if(el.hasAttribute('contenteditable')){
        task.name = el.textContent.trim() || task.name
    } else{
        const span = el.nextElementSibling
        const parent = el.closest('li')

        task.isCompleted = el.checked

        if(task.isCompleted){
            span.removeAttribute('contenteditable')
            parent.classList.add('completed')
        } else {
            span.setAttribute('contenteditable', 'true')
            parent.classList.remove('completed')
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks))
    countTasks()
}