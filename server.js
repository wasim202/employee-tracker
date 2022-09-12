const path = require("path");
const inquirer = require("inquirer");
//const mainMenu = require("./generateQuestions");
const mysql = require("mysql2");
const cTable = require("console.table");
const util = require("util");
const { response } = require("express");
const { allowedNodeEnvironmentFlags } = require("process");

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
        "add a role",
        "add an employee",
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
    "add a role": addRole,
    "add an employee": addEmployee,
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
    db.query(`INSERT INTO department (name) VALUES (?)`, data.name);
    console.log("Added", data.name, "to the database");
    start();
  } catch (err) {
    console.log(err);
  }
};

const addRole = async () => {
  try {
    const data = await inquirer.prompt([
      {
        type: "input",
        message: "What is the name of the Role?",
        name: "name",
      },
      {
        type: "input",
        message: "What is the salary of the Role?",
        name: "salary",
      },
      {
        type: "input",
        message: "Which department does the role belong to?",
        name: "depName",
      },
    ]);
    console.log(data);
    db.query(
      "SELECT id FROM department where name = ?",
      data.depName,
      function (err, record) {
        //console.log(record);
        db.query(
          `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`,
          [data.name, data.salary, record[0].id],
          function (err, result) {
            console.log("Added", data.name, "to the database");
            start();
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
  }
};

const addEmployee = async () => {
  try {
    const data = await inquirer.prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "fname",
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "lname",
      },
      {
        type: "list",
        message: "What is the employee's role",
        name: "empMenu",
        choices: [
          "Sales Lead",
          "Sealsperson",
          "Lead Engineer",
          "Software Engineer",
          "Account Manager",
          "Accountant",
          "Legal Team Lead",
          "Lawyer",
          "Customer Service",
        ],
      },
      {
        type: "list",
        message: "What is the employee's manager",
        name: "empManMenu",
        choices: [
          "None",
          "John Doe",
          "Mike Chan",
          "Ashley Rodriguez",
          "Kevin Tupik",
          "Kunal Singh",
          "Malia Brown",
        ],
      },
    ]);
    db.query(
      `SELECT e.id FROM employee e LEFT JOIN employee m WHERE m.id = e.manager_id and m.first_name = ?`,
      data.empManMenu,
      function (err, record) {
        console.log(record);
        db.query(
          `INERST INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
          [data.fname, data.lname, data.empMenu, record.id],
          function (err, result) {
            console.log("Added", data.fname, data.lname, "to the database");
            start();
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
  }
};

start();
