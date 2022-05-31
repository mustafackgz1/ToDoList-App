const taskInput = document.querySelector(".task-input input");
taskBox = document.querySelector(".task-box");
filters = document.querySelectorAll(".filters span");
clearAllBtn = document.querySelector(".clear-btn");


let editId;
let isEditedTask = false;
let todos = JSON.parse(localStorage.getItem("todo-list"));//getting LS todo-list


filters.forEach(btn =>{ //filters altındaki spanlar arası geçiş
    btn.addEventListener("click", () =>{
        document.querySelector("span.active").classList.remove("active")
        btn.classList.add("active")
        showToDo(btn.id);
    })
})


function showToDo(filter) {
    let li = " ";
    if(todos){
        todos.forEach((todo, id) =>{
            let isCompleted = todo.status == "completed" ? "checked" : "" ;
            if(filter == todo.status || filter == "all"){ //kategorilere göre ayrıştırdık
                li += `<li class="task">
                        <label for="${id}">
                            <input onclick=updateStatus(this) type="checkbox" id="${id}" ${isCompleted}>
                            <p class="${isCompleted}">${todo.name}</p>
                        </label>
                        <div class="settings">
                            <i onclick="showMenu(this)" class="fas fa-ellipsis-h"></i>
                            <ul class="task-menu">
                                <li onclick="editTask(${id}, '${todo.name}')"><i class="fa-solid fa-pen-to-square"></i>Edit</li>
                                <li onclick="deleteTask(${id})"><i class="fas fa-trash-alt"></i>Delete</li>
                            </ul>
                        </div>
                    </li>`  
            }
        });
    }
    taskBox.innerHTML = li || `<span>You don't have any tasks here</span>` ;
}
showToDo("all");

function showMenu(selectedTask){
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show")
    document.addEventListener("click", e =>{
        if(e.target.tagName != "I" || e.target != selectedTask){ //3 noktaya tıkladığımızda geri kapatan kod
            taskMenu.classList.remove("show");
        }
    });
}

function editTask(taskId, taskName){
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
}
function deleteTask(deleteId) {
    todos.splice(deleteId, 1);//removing selected task from array(todos)
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showToDo("all");
}

clearAllBtn.addEventListener("click", () =>{
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showToDo("all");
})


function updateStatus(selectedTask){
    let taskName = selectedTask.parentElement.lastElementChild;//getting paragraph that contains task name
    if(selectedTask.checked){
        taskName.classList.add("checked")
        todos[selectedTask.id].status = "completed"//updating the status of selected task to completed
    }else{
        taskName.classList.remove("checked")
        todos[selectedTask.id].status = "pending"//updating the status of selected task to pending
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}


taskInput.addEventListener("keyup", e =>{
    let userTask = taskInput.value.trim();
    if(e.key == "Enter" && userTask){
        if(!isEditedTask){
            if(!todos){
                todos = []; //if todos doesn't exist, pass an empty array
            }
            let taskInfo = {name: userTask,status: "pending"};
            todos.push(taskInfo); //adding new task to todos
        }
        else{
            isEditedTask = false;
            todos[editId].name = userTask;

        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showToDo("all");
    }

})