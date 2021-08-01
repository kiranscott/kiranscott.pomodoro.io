import express from "express";
//import session from "express-session";
import Handler from "./handler.js";

const port = 8080;
const app = express();

app.use("/", express.static("web-app/static"));

app.use("/", express.json());

app.post("/", function (req, res) {
    const request_object = req.body;
    //handler gives us a promise to a response, return response
    Handler[request_object.type](request_object).then(

        function (response_object) {
            res.json(response_object);
        }
    );
});


app.listen(port, function () {
    console.log(`Listening on port ${port} – http://localhost:${port}`);
});
