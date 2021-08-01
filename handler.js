const Handler = Object.create(null);

//create an empty array to use later
let Todos_list = [];

//use this in the main in the save function
Handler.get_todos = function (request_object) {
    console.log(request_object);
    return Promise.resolve({"list": Todos_list});
};

//use this in the main in the load_todos function
Handler.save_todos = function (request_object) {
    console.log(request_object);
    Todos_list = request_object.list;
    return Promise.resolve({"results": "done"});
};

//use this in the main in the deleteCheck function
Handler.delete_todos = function (request_object) {
    console.log(request_object);
    Todos_list = Todos_list.filter((r) => r !== request_object.name);
    return Promise.resolve({"list": Todos_list});
};


export default Object.freeze(Handler);