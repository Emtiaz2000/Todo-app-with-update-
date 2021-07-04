const input = document.getElementById('todo')
const tbody = document.querySelector('tbody')
const submitBtn = document.querySelector('.submitBtn')
const alertContainer = document.querySelector('.alertContainer')
const updateBtn = document.querySelector('.Update')

//class for creating new todo stracture
class Todo {
    constructor(todo, id) {
        this.todo = todo
        this.id = id
    }
}

class Ui {
    //create new todos
    createTodo({todo,id}) {
        const tr = document.createElement('tr')
        tr.innerHTML = `<td>${id}</td>
        <td>${todo}</td>
        <td><button class="btn btn-primary edit" data-id="${id}">Edit</button> <button class="btn btn-danger delete" data-id="${id}">Delete</button></td>`
        tbody.appendChild(tr)
    }

    //clear input field
    clearInput(){
        input.value=''
    }

    //showing alert after delete or add todo 
    alertUp(text,status){
        const div = document.createElement('div')
        div.className = `alert alert-${status} alertup`
        div.innerHTML = `${text}`
        alertContainer.prepend(div)

        setTimeout(()=>{
            div.remove()
        },2000)
    }

}

class Store{
    //storing data to local storage
   static storeData(todo){
        let todos;
        if(localStorage.getItem('todo')=== null){
            todos = []
        }else{
            todos = JSON.parse(localStorage.getItem('todo'))
        }
        todos.push(todo)
        localStorage.setItem('todo',JSON.stringify(todos))
    }

    //return localstorage data in a array
    static getDataFromLocalStorage(){
        let todos;
        if(localStorage.getItem('todo')=== null){
            todos = []
        }else{
            todos = JSON.parse(localStorage.getItem('todo'))
        }
        return todos
    }

    //use localstorage data for showing in up after new load
    static manupulateData(){
        const todo = Store.getDataFromLocalStorage()

        todo.forEach(ele => {
            const ui = new Ui()
            ui.createTodo(ele)
        });
    }

    //delete todo for individual id
    static deleteTodoFromLocalStorage(id){
        const todo = Store.getDataFromLocalStorage()
        todo.forEach((ele,index) => {
          if(ele.id === id){
              todo.splice(index,1)
          }
          localStorage.setItem('todo',JSON.stringify(todo))
        });
    }
}

//show localstorage data after load
window.addEventListener('DOMContentLoaded',Store.manupulateData())

//add new todo from the form
submitBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if (input.value === '') {
        alert('Provide the todos')
        return 
    }
    let id = tbody.querySelectorAll('tr').length + 1
    const todo = new Todo(input.value,id)
    const ui = new Ui()
    ui.createTodo(todo)
    ui.clearInput()
    Store.storeData(todo)
    ui.alertUp("Todo add successfully","success")
    
})


//delete todos from ui part and also localStorage
tbody.addEventListener('click',(e)=>{
   
     if(e.target.className.includes('delete')){
         let id = parseInt(e.target.dataset.id)
         Store.deleteTodoFromLocalStorage(id)
         e.target.parentElement.parentElement.remove()
        const ui = new Ui()
        ui.alertUp("Todo deleted successfully","danger")
    } 
})


//geting the edit value
tbody.addEventListener('click',(e)=>{
   
    if(e.target.className.includes('edit')){
        document.querySelector('.hideBtn').classList.remove('hideBtn')
        document.querySelector('.submitBtn').classList.add('hideBtn')
        let id = parseInt(e.target.dataset.id)
        updateBtn.setAttribute('data-id',id)
        input.value = e.target.parentElement.previousElementSibling.textContent
   } 
})

//update the todos
updateBtn.addEventListener('click',()=>{
    let id = parseInt(updateBtn.getAttribute('data-id'))
    if(input.value === ''){
        alert('Please add the todo')
        return
    }
    const findValueforUpdate = Store.getDataFromLocalStorage()
    findValueforUpdate.forEach(ele =>{
        if(ele.id == id){
            ele.todo = input.value
        }
        localStorage.setItem('todo',JSON.stringify(findValueforUpdate))
        
    })
    window.location.reload()
})
