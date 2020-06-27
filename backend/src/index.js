const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const { uuid, isUuid } = require("uuidv4");

//Jamais usar em produção
//array guardar em memória porque não se está usando um banco de dados aqui

const repositories = [];

function logRequests(request, response, next) {
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);
  next();
  console.timeEnd(logLabel);
}

app.use(logRequests);

validateProject = (request, response, next) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project ID" });
  }
  return next();
};

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title
    ? repositories.filter((repository) => repository.title.includes(title))
    : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };

  repositories.push(project);

  return response.json(project);
});

app.put("/repositories/:id", validateProject, (request, response) => {
  const { id } = request.params;

  const { title, owner } = request.body;

  const projectIndex = repositories.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found" });
  }

  const repository = {
    id,
    title,
    owner,
  };

  repositories[projectIndex] = repository;
  return response.json(repositories);
});

app.delete("/repositories/:id", validateProject, (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found" });
  }

  repositories.splice(projectIndex, 1);

  return response.status(204).send();
});

app.listen(3333, () => console.log("🤓👍 Back-end started"));
