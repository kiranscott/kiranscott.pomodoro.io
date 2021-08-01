const Push = Object.create(null);

//Simple function that takes in the exisitng todo_list and appends
//a new todo to said list (name).
Push.anotherTodo = function (todos_list, name) {
    todos_list.push(name);
    console.log(todos_list);
};

export default Object.freeze(Push);