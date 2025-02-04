import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 2999;
const mockUsers = [
    { id: 1, username: "John", display: "John Doe" },
    { id: 2, username: "Jane", display: "Jane Doe"},
    { id: 3, username: "Jill", display: "Jill Doe"},
];

app.get("/", (req, res) => {
    res.status(201).send({msg: "Hello"});
});

app.get("/api/users", (req, res) => {
    console.log(req.query);
    const {
        query: { filter, value },
    } = req;
    if (!filter && !value) return res.send(mockUsers);
    if (filter && value) {
        return res.send(
            mockUsers.filter((user) => user[filter].includes(value))
        );
    }
});

app.post("/api/users", (req, res) => {
    const { body } = req;
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
})

app.get("/api/users/:id", (req, res) => {
    console.log(req.params.id);
    const parsedID = parseInt(req.params.id);
    if (isNaN(parsedID)) {
        res.status(400).send({msg: "Invalid ID"});
    } else {
        const user = mockUsers.find(user => user.id === parsedID);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({msg: "User not found"});
        }
    }
})

app.get('/api/products', (req, res) => {
    res.send([
        { id: 11, name: 'Apple', price: 1.99 },
        { id: 12, name: 'Orange', price: 2.99 },
        { id: 13, name: 'Banana', price: 0.99 }
    ]);
});

app.put('/api/users/:id', (req, res) => {
    const {
        body,
        params: { id },
    } = req;

    const parsedID = parseInt(id);
    if(isNaN(parsedID)) {
        res.status(400).send({msg: "Invalid ID"});
    }

    const findUserIndex = mockUsers.findIndex(user => user.id === parsedID);
    if (findUserIndex === -1) {
        res.status(404).send({msg: "User not found"});
    }
    mockUsers[findUserIndex] = { id: parsedID, ...body };
    return res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});

