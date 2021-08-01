import Ajax from "./ajax.js";
import Push from "./push.js";
import Timer from "./timer.js";
import RemTime from "./remtime.js";

//Create variables from HTML elements
const mainButton = document.getElementById("btn");
const todosInput = document.querySelector(".todos-input"); //Todo input text box
const todosButton = document.querySelector(".todos-button"); //Add todo button
const todosList = document.querySelector(".todos-list"); //List of todo objects
const saveButton = document.querySelector(".save-button"); // Save list button
const modeButtons = document.querySelector("#mode-buttons");//3 timer modes

//Create EventListeners to run appropriate functions
document.addEventListener("DOMContentLoaded", init);
todosButton.addEventListener("click", addTodo); //call addTodo when clicked
todosList.addEventListener("click", deleteCheck);
//call deleteCheck on list items when clicked
saveButton.addEventListener("click", save); //call save when clicked
modeButtons.addEventListener("click", handleMode);
//value of data-action attribute of button stored in action variable and checked
//to see if it equals to "start", if so StartTimer function called.
mainButton.addEventListener("click", () => {
    buttonSound.play();
    const { action } = mainButton.dataset;
    if (action === "start") {
        startTimer();
    } else {
        stopTimer();
    }
});

//Variables
const buttonSound = new Audio("button_sound.mp3");

const timer = {
    workSesh: 25, //length of a work cycle in mins
    shortBreak: 5, //length of a short break in mins
    longBreak: 20, //length of a long break in mins
    cyclesRequired: 4, //amount of cycles before long break
    pomodoros: 0 //keeps track of no. of pomodoro cycles elapsed
};

let interval; //setInterval gets attached to this variable
let todos_list = []; //empty todo-list array

function init(){
    loadTodos();
    if (confirm("Press OK to start timer in test mode" +
                "\nThis will set the study and break times to 1 minute each," +
                "\nhelpful for demonstrating the timer's mode switching" +
                "\npressing cancel will start the web app normally")) {
        timer.workSesh = 1;
        timer.longBreak = 1;
        timer.shortBreak = 1;
    }
    Timer.switchMode("workSesh"); //sets default timer mode to work
}

//TIMER FUNCTIONS - updates timer element, handle work / break cycles

//Main timer function
function startTimer() {
    let { total } = timer.remainingTime; //total from getRemainingTime stored
    //get exact time in the future when timer ends by retrieving current
    //timestamp (Date.parse(), in milliseconds) and adding total milliseconds
    //in the session to it. value then stored in endTime variable.
    const endTime = Date.parse(new Date()) + total * 1000;

    //incrememts pomodoro count property at the start of a workSesh
    if (timer.mode === "workSesh") {
        timer.pomodoros += 1;
    }

    mainButton.dataset.action = "stop";//data-action attribute changed to "stop"
    mainButton.textContent = "stop";//text content changed to "stop"
    mainButton.classList.add("active");//button becomes pressed via active class

    //setInterval method executes callback function every 1000 milliseconds (1s)
    interval = setInterval(function() {
        timer.remainingTime = RemTime.getRemainingTime(endTime);
        Timer.updateClock();
        //updated value of total property in .remainingTime checked if less than
        //or equal to 0. If so clearInterval stops countdown.
        total = timer.remainingTime.total;
        if (total <= 0) {
            clearInterval(interval);
            //switch to new short / break session depending on timer.mode
            switch(timer.mode) {
                case "workSesh":
                    //switches to longBreak if pomodoros / into cyclesRequired
                    //with no remainders (timer object properties)
                    if (timer.pomodoros % timer.cyclesRequired === 0) {
                        Timer.switchMode("longBreak");
                    } else {
                        //otherwise short break session triggered
                        Timer.switchMode("shortBreak");
                    }
                    break;
                default:
                    //default case executed by break ending, starts new pomodoro
                    Timer.switchMode("workSesh");
            }
            document.querySelector(`[data-sound="${timer.mode}"]`).play();
            startTimer(); //startTimer called within itself
            console.log(timer);
        }
    }, 1000);
}

//Clears interval and resets timer button to 'start'
function stopTimer() {
    clearInterval(interval);//cancels interval stopping countdown
    timer.pomodoros = 0;
    mainButton.dataset.action = "start";//data-action attribute changed to start
    mainButton.textContent = "start";//text content changed to start
    mainButton.classList.remove("active");//button returns to original form
}

//Pulls data-mode attribute from element and passes it to switchMode
function handleMode(event) {
    //value of data-mode attribute is retreived from target element
    const { mode } = event.target.dataset;
    //if attribute does not exist, function exits
    if (!mode) {
        return;
    }
    //Otherwise switchMode() is called with data-mode value as argument
    Timer.switchMode(mode);
    stopTimer(); //stops timer when mode is changed via 3 top buttons
}



//HANDLER FUNCTIONS - uses Ajax to save and load todos_list to the server

//runs the handler function "get_todos",
//awaits saved todos_list as a response,
//creates a UI element for each item in todos_list
function loadTodos(){
    Ajax.query({"type":"get_todos"}).then(function(response){
        console.log(response);
        todos_list = response.list;
        todos_list.forEach((element) => {
            addTodoUI(element);
        });
});
}

//saves the current todo_list via the handler function "save_todos",
//passes the todo_list array,
//awaits "done" from handler
function save(set){
    set.preventDefault();
    Ajax.query({"type":"save_todos", "list":todos_list})
    .then(function(response){
        console.log(response);
});
}


//TODO FUNCTIONS - handles generation, functionality, removal of todo list items

//handles adding todo items
//Grabs the text written in the text box and sends it addTodoUI
//uses the function in 'Push.js' to append to todos_list
function addTodo(set){
    set.preventDefault();
    const name = todosInput.value;
    addTodoUI(name);
    Push.anotherTodo(todos_list, name);
}

//handles generating the UI elements required for each todo item
//uses .createElement to create new HTML elements
function addTodoUI(name){
    //creates new todo division with class "todo"
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    const newTodo = document.createElement("li");
    newTodo.innerText = name;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    //generates the complete button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = "<i class='fas fa-check'></i>";
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    //generates the remove button
    const removeButton = document.createElement("button");
    removeButton.innerHTML = "<i class='fas fa-trash'></i>";
    removeButton.classList.add("remove-btn");
    todoDiv.appendChild(removeButton);
    //Appends the new todo construct to the HTML list
    todosList.appendChild(todoDiv);

     //clear input string
    todosInput.value = "";
    console.log(todosList);
}

//adds functionality to the remove and complete button
function deleteCheck(e) {
    const object = e.target;
    const todo = object.parentElement;

    //call handler function "delete_todos" when remove-btn is clicked
    //this removes the todo from todo_list
    //also plays a css transition for visual flair
    if (object.classList[0] === "remove-btn") {
        todo.classList.add("drop");
        todo.addEventListener("transitionend", function(){
            todo.remove();
        });
        Ajax.query({"type":"delete_todos",
        "name":todo.querySelector("li")
        .textContent});
    }
    //call css to strikethrough todo item when completed-btn is clicked
    if (object.classList[0] === "complete-btn") {
        // const todo2 = object.parentElement;
        todo.classList.toggle("completed");
        console.log(todo.classList.contains("completed"));
    }
}
export { timer };

