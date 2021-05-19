import {createStore} from './redux-store'

// App Code
const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GOAL = 'REMOVE_GOAL'

const todoActions = {
    add: (todo) => ({
        type: ADD_TODO,
        todo,
    }),
    remove: (id) => ({
        type: REMOVE_TODO,
        id,
    }),
    toggle: (id) => ({
        type: TOGGLE_TODO,
        id,
    })
}


const goalActions = {
    add: (goal) => ({
        type: ADD_GOAL,
        goal,
    }),
    remove: (id) => ({
        type: REMOVE_GOAL,
        id,
    }),
}


function todos (state = [], action) {
    switch(action.type) {
    case ADD_TODO :
        return state.concat([action.todo])
    case REMOVE_TODO :
        return state.filter((todo) => todo.id !== action.id)
    case TOGGLE_TODO :
        return state.map((todo) => todo.id !== action.id ? todo :
        Object.assign({}, todo, { complete: !todo.complete }))
    default :
        return state
    }
}

function goals (state = [], action) {
    switch(action.type) {
    case ADD_GOAL :
        return state.concat([action.goal])
    case REMOVE_GOAL :
        return state.filter((goal) => goal.id !== action.id)
    default :
        return state
    }
}

function app (state = {}, action) {
    return {
        todos: todos(state.todos, action),
        goals: goals(state.goals, action),
    }
}

const store = createStore(app)

store.subscribe(() => {
    updateTodoAndGoalsLists();
})

const updateTodoAndGoalsLists = () => {
    const todoList = document.getElementById('todoList');
    const goalsList = document.getElementById('goalsList');

    const {todos, goals} = store.getState();

    if(todos.length > 0 || goals.length > 0){    
        todoList.innerHTML = "";
        goalsList.innerHTML = "";

        todos.forEach(updateTodoListItems);  

        goals.forEach(updateGoalsListItems);  
    }
}

const updateTodoListItems = (todoItem) => {
    const todoListItem = document.createElement('li');

    const removeButton = createRemoveButton(() => {
        store.dispatch(todoActions.remove(todoItem.id));
    });
    
    todoListItem.appendChild(document.createTextNode(todoItem.name));
    todoListItem.appendChild(removeButton);

    // Initially set the decoration
    todoListItem.style.textDecoration = todoItem.complete ? 'line-through' : 'none';
    todoListItem.addEventListener('click', () => {
        store.dispatch(todoActions.toggle(todoItem.id))
    })

    todoList.appendChild(todoListItem);
}

const updateGoalsListItems = (goalItem) => {
    const goalListItem = document.createElement('li');

    const removeButton = createRemoveButton(() => {
        store.dispatch(goalActions.remove(goalItem.id));
    });

    goalListItem.appendChild(document.createTextNode(goalItem.name));
    goalListItem.appendChild(removeButton);

    goalsList.appendChild(goalListItem);

}

const createRemoveButton = (onClickHandler) => {
    const removeButton = document.createElement('button')
    removeButton.innerHTML = 'x';
    removeButton.addEventListener('click', onClickHandler);

    return removeButton
}

const addTodo = () => {
    const input = document.getElementById('todoItem');
    const name = input.value;

    store.dispatch(todoActions.add({
        id: store.getState() ? store.getState().todos.length + 1 : 0,
        name,
        complete: false,
    }))
}

const addGoal = () => {
    const input = document.getElementById('goalItem');
    const name = input.value;

    store.dispatch(goalActions.add({
        id: store.getState() ? store.getState().goals.length + 1 : 0,
        name,
    }))
}

document.getElementById('todoBtn').addEventListener('click', addTodo);
document.getElementById('goalBtn').addEventListener('click', addGoal);