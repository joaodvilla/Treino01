const express = require("express");
const server = express();

server.use(express.json());

let numberOfRequests = 0;

const projects = [
  {
    id: "1",
    title: "Projeto 1",
    tasks: []
  },
  {
    id: "2",
    title: "Projeto 2",
    tasks: []
  },
  {
    id: "3",
    title: "Projeto 3",
    tasks: []
  }
];

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);
  if (!project) {
    return res.status(400).json({ error: "project does not exists" });
  }
  return next();
}

function logRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
}

server.get("/projects", logRequests, (req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", checkProjectExists, logRequests, (req, res) => {
  return res.json(projects[req.params.id]);
});

server.post("/projects", logRequests, (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);

  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, logRequests, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, logRequests, (req, res) => {
  const { id } = req.params;

  const project = projects.findIndex(p => p.id === id);

  projects.splice(project, 1);

  return res.send();
});

server.post(
  "/projects/:id/tasks",
  checkProjectExists,
  logRequests,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id === id);

    project.tasks.push(title);

    return res.json(projects);
  }
);

server.listen(3000);
