const express = require("express");
const path = require("path");
const inquirer = require("inquirer");
//const mainMenu = require("./generateQuestions");
const mysql = require("mysql2");
const cTable = require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "123456789",
    database: "EmployeeManager_db",
  },
  console.log(`Connected to the EmployeeManager_db database.`)
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use("/api", api);
app.use(express.static("public"));

inquirer
  .prompt([
    {
      type: "list",
      message: "what would you like to do?",
      name: "mainMinu",
      choices: [
        "view all departments",
        "view all rolls",
        "view all employees",
        "add a department",
        "add a role",
        "add an employee",
        "update an employee role",
        "quit",
      ],
    },
  ])
  .then((Response) => {
    switch (Response.mainMenu) {
      case "view all departments":
        db.query("SELECT * FROM department", function (err, Response) {
          console.log(Response);
        });
        break;
      case "view all rolls":
        db.query("SELECT * FROM role", function (err, Response) {
          console.log(Response);
        });
        break;
      case "view all employees":
        db.query("SELECT * FROM employee", function (err, Response) {
          console.log(Response);
        });
        break;
    }
  });

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
