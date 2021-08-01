import Push from "../static/push.js";
import fc from "fast-check";
import property from "./property.js";

describe("Todo_tests", function () {

    property(
        "Adding 3 todos to an empty todo list" +
        "should result in a todo list with a length of 3",
        [fc.string(1, 10)], //generates random todos
        function (string) {
            let todos_list = [];
            for (let i = 0; i < 3; i++) {
                Push.anotherTodo(todos_list, string);
            }
            return todos_list.length === 3;

        }

    );

    property(
        "Adding 4 todos to a todo list should increase its length by 4 ",
        [fc.string(1, 10)],
        function (string) {
            let todos_list = ["Finish assignment", "Export PDF", "Code list"];
            let previous_length = todos_list.length;
            for (let i = 0; i < 4; i++) {
                Push.anotherTodo(todos_list, string);
            }
            return todos_list.length === previous_length + 4;
        }
    );

    property(
        "Adding n todos to a todo list should result in a list of length n",
        [fc.constantFrom(0, 10)],
        function (number) {
            let todos_list = [];
            for (let i = 0; i < number; i++) {
                Push.anotherTodo(todos_list, number);
            }
            return todos_list.length === number;

        }

    );

});

