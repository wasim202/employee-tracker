const path = require("path");
const inquirer = require("inquirer");
//const mainMenu = require("./generateQuestions");
const mysql = require("mysql2");
const cTable = require("console.table");
const util = require("util");
const { response } = require("express");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "123456789",
    database: "EmployeeManager_db",
  },
  console.log(`Connected to the EmployeeManager_db database.`)
);

const query = util.promisify(db.query).bind(db);

const start = async () => {
  const Response = await inquirer.prompt([
    {
      type: "list",
      message: "what would you like to do?",
      name: "mainMenu",
      choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "add a department",
        // "add a role",
        // "add an employee",
        // "update an employee role",
        // "quit",
      ],
    },
  ]);
  //console.log(Response);
  const choices = {
    "view all departments": allDep,
    "view all roles": allRoles,
    "view all employees": allEmp,
    "add a department": addDepartment,
    // "add a role",
    // "add an employee",
    // "update an employee role",
    // "quit",
  };
  await choices[Response.mainMenu]();

  // switch (Response.mainMenu) {
  //   case "view all departments":
  //     // db.query("SELECT * FROM department", function (err, Response) {
  //     //   console.log(Response);
  //     // });
  //     allDep();
  //     break;
  //   case "view all rolls":
  //     db.query("SELECT * FROM role", function (err, Response) {
  //       console.log(Response);
  //     });
  //     break;
  //   case "view all employees":
  //     db.query("SELECT * FROM employee", function (err, Response) {
  //       console.log(Response);
  //     });
  //     break;
  // }
};

// function allDep() {
//   query("SELECT * FROM department").then((Response) => {
//     console.table(Response);
//   });
// }
const allDep = async () => {
  try {
    //console.log("all departments");
    const Response = await query("SELECT * FROM department");
    console.table(Response);
    start();
  } catch (err) {
    console.log(err);
  }
};

const allRoles = async () => {
  try {
    //console.log("all departments");
    const Response = await query(
      "SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON department.id = role.department_id"
    );
    console.table(Response);
    start();
  } catch (err) {
    console.log(err);
  }
};

const allEmp = async () => {
  try {
    //console.log("all departments");
    const Response = await query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );
    console.table(Response);
    start();
  } catch (err) {
    console.log(err);
  }
};

const addDepartment = async () => {
  try {
    const data = await inquirer.prompt([
      {
        type: "input",
        message: "What is the name of the department?",
        name: "name",
      },
    ]);
    db.query(`INSERT INTO department (name) VALUES ?`, data.name);
    console.log("Added", data.name, "to the database");
    start();
  } catch (err) {
    console.log(err);
  }
};

start();
