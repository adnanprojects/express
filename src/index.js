import express from "express";
import { query, validationResult, body } from "express-validator";

const app = express();

// Middleware
app.use(express.json());

// Port
const PORT = process.env.PORT || 3000;

const users = [
  { id: 1, name: "adnan", age: 26 },
  { id: 2, name: "kashan", age: 25 },
  { id: 3, name: "arisha", age: 23 },
  { id: 4, name: "zaid", age: 19 },
];

// <--- HTTP requests --->

// Home
app.get("/", (request, response) => {
  try {
    response.send("Home");
  } catch (error) {
    console.error(error.message);
  }
});

// Create data
app.post("/users", body(), (request, response) => {
  try {
    const { body } = request;
    const addUser = { id: users[users.length - 1].id + 1, ...body };
    users.push(addUser);
    response.status(201).send(addUser);
  } catch (error) {
    console.error(error.message);
  }
});

// Fetch data
app.get(
  "/users",
  query("filter")
    .isString()
    .withMessage("Should be string")
    .notEmpty()
    .withMessage("Should not be empty")
    .isLength({ min: 3, max: 20 })
    .withMessage("should be atleast 3 character max of 20 characters"),
  (request, response) => {
    try {
      const result = validationResult(request);
      console.log(result);
      const {
        query: { filter, value },
      } = request;
      if (filter && value)
        return response.send(users.filter((u) => u[filter].includes(value)));
      return response.send(users);
    } catch (error) {
      console.error(error.message);
    }
  }
);

app.get("/users/:id", (request, response) => {
  try {
    const {
      params: { id },
    } = request;
    const userId = parseInt(id);
    if (isNaN(userId))
      return response.status(400).send({ message: "Bad request, Invalid id" });
    const user = users.find((u) => u.id === userId);
    if (!user) return response.status(404).send({ message: "User not found" });
    return response.send(user);
  } catch (error) {
    console.error(error.message);
  }
});

// Update data
app.put("/users/:id", (request, response) => {
  try {
    const {
      body,
      params: { id },
    } = request;
    const userId = parseInt(id);
    if (isNaN(userId)) return response.sendStatus(400);
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return response.sendStatus(404);
    users[userIndex] = { id: userId, ...body };
    response.sendStatus(200);
  } catch (error) {
    console.error(error.message);
  }
});

app.patch("/users/:id", (request, response) => {
  try {
    const {
      params: { id },
      body,
    } = request;
    const userId = parseInt(id);
    if (isNaN(userId)) return response.sendStatus(400);
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return response.sendStatus(404);
    users[userIndex] = { ...users[userIndex], ...body };
    return response.sendStatus(200);
  } catch (error) {
    console.error(error.message);
  }
});

// Delete data
app.delete("/users/:id", (request, response) => {
  try {
    const {
      params: { id },
    } = request;
    const userId = parseInt(id);
    if (isNaN(userId)) return response.sendStatus(400);
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return response.sendStatus(404);
    users.splice(userIndex, 1);
    return response.sendStatus(200);
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`App is running on port : ${PORT}`);
});
