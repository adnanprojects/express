import express from 'express';
import { query, validationResult } from 'express-validator';

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const mockUsers = [
    { id: 1, name: 'adnan' },
    { id: 2, name: 'zaid' },
    { id: 3, name: 'kashan' },
];

const findIndexByUserId = (request, response, next) => {
    const { params: { id } } = request;
    const parseId = parseInt(id);
    if (isNaN(parseId)) return response.sendStatus(400);
    const userIndex = mockUsers.findIndex(user => user.id === parseId);
    if (userIndex === -1) return response.sendStatus(404);
    request.userIndex = userIndex;
    next();
};

app.get('/', (request, response) => response.status(201).send({ message: 'hello' }));

app.get('/api/users', query('filter').isString().notEmpty(), (request, response) => {
    const result = validationResult(request);
    const { filter, value } = request.query;
    if (filter && value) {
        return response.send(mockUsers.filter(user => user[filter].includes(value)));
    };
    return response.send(mockUsers);
    // TODO: Handle the case in for which filter is wrong and check for value, like: filter=specialname&value=adnan & filter=name&value=23
});

app.post('/api/users', (request, response) => {
    const { body } = request;
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
});

app.get('/api/users/:id', (request, response) => {
    const parseId = parseInt(request.params.id);
    if (isNaN(parseId)) return response.status(400).send({ message: 'Bad Request, Invalid ID' });
    const findUser = mockUsers.find(user => user.id === parseId);
    if (!findUser) return response.sendStatus(404);
    return response.send(findUser);
});

app.put('/api/users/:id', findIndexByUserId, (request, response) => {
    const { body, userIndex } = request;
    mockUsers[userIndex] = { id: mockUsers[userIndex].id, ...body };
    return response.sendStatus(200);
});

app.patch('/api/users/:id', findIndexByUserId, (request, response) => {
    const { body, userIndex } = request;
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...body };
    return response.sendStatus(200);
});

app.delete('/api/users/:id', (request, response) => {
    const { userIndex } = request;
    mockUsers.splice(userIndex, 1);
    return response.sendStatus(200);
});

app.get('/api/products', (request, response) => response.send([
    { id: 12, name: 'chicken tikka', price: 149 }
]));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));