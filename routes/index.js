import express from "express";

// initialize express
const app = express();
app.use(express.json());


// a middleware function that logs the request method and url
const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
}

// a middleware function that resolves findUserIndex based on the id
const resolveIndexByUserID = (req, res, next) => {
    const {
        params: { id },
    } = req;

    // return an error if the id is not a number
    const parsedID = parseInt(id);
    if (isNaN(parsedID)) {
        res.status(400).send({msg: "Invalid ID"});
    }

    // find the user index based on the parsed id, return an error if a user could not be found
    const findUserIndex = mockUsers.findIndex(user => user.id === parsedID);
    if (findUserIndex === -1) {
        res.status(404).send({msg: "User not found"});
    }

    req.findUserIndex = findUserIndex;
    next();
}

app.use(loggingMiddleware);

// assign a port number for the localhost
const PORT = process.env.PORT || 2999;

/* mock users array that will be manipulated through different request types
 * contains fake data types such as id, username, and display name
 */
const mockUsers = [
    { id: 1, username: "John", display: "John Doe" },
    { id: 2, username: "Jane", display: "Jane Doe"},
    { id: 3, username: "Jill", display: "Jill Doe"},
];

// create a route for the root of the server
app.get("/", (req, res) => {
    res.status(201).send({msg: "Hello"});
});

// get requests in order to grab all user data through filters
app.get("/api/users", (req, res) => {
    console.log(req.query);

    // destructure the query object from the request with filter and value parameters
    const {
        query: { filter, value },
    } = req;

    // if there is no filter or value, return all users, otherwise return filtered data
    if (!filter && !value) return res.send(mockUsers);

    if (filter && value) {
        return res.send(
            mockUsers.filter((user) => user[filter].includes(value))
        );
    }
});

// post requests in order to add new user data
app.post("/api/users", (req, res) => {
    const { body } = req;

    // essentially add a new user to the mockUsers array with a consecutive id and the user body
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
})

// a get request to grab user data based on the id
app.get("/api/users/:id", resolveIndexByUserID, (req, res) => {
    const { findUserIndex } = req;
    const user = mockUsers[findUserIndex];
    if (user) {
        res.send(user);
    } else {
        // error 404 if the parsed id can't find an account
        res.status(404).send({msg: "User not found"});
    }
})

// a get request that returns a list of mock products
app.get('/api/products', (req, res) => {
    res.send([
        { id: 11, name: 'Apple', price: 1.99 },
        { id: 12, name: 'Orange', price: 2.99 },
        { id: 13, name: 'Banana', price: 0.99 }
    ]);
});

// a put request to update user data based on the id
app.put('/api/users/:id', resolveIndexByUserID, (req, res) => {
    const { body, findUserIndex } = req;

    // update the user using the parsed id and the body
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return res.sendStatus(200);
});

// a patch request to update specific data based on the id
app.patch('/api/users/:id', resolveIndexByUserID, (req, res) => {
    const { body, findUserIndex } = req;

    // once again update the user using the parsed id and the body
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return res.sendStatus(200);
});

// a delete request that deletes a user based on the id
app.delete("/api/users/:id", resolveIndexByUserID, (req, res) => {
    const { findUserIndex } = req.params;

    // a splice method used to delete the user based on the index, "1" param is necessary to specify one account
    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);

})

// assign the port to the app
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});

