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
        "update an employee role",
        "Quit",
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
    "update an employee role": updateRole,
    quit: quit,
  };
  await choices[Response.mainMenu]();
};

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
    const roles = await query("SELECT id AS value, title AS name FROM role");
    const managers = await query(
      "SELECT id As value, concat(first_name, ' ' ,last_name) As name FROM employee WHERE manager_id is NULL"
    );
    //console.log(roles);
    //console.log(managers);
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
        choices: roles,
      },
      {
        type: "list",
        message: "What is the employee's manager",
        name: "empManMenu",
        choices: managers,
      },
    ]);
    console.log(data);
    await query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
      [data.fname, data.lname, data.empMenu, data.empMenu]
    );
    console.log("Added", data.fname, data.lname, "to the database");
    await start();
  } catch (err) {
    console.log(err);
  }
};

const updateRole = async () => {
  try {
    const employees = await query(
      'SELECT id As value, CONCAT (first_name, " " ,last_name) AS name FROM employee'
    );
    const roleName = await query("SELECT id As value, title As name FROM role");
    //console.log(employees);
    //console.log(roleName);
    const data = await inquirer.prompt([
      {
        type: "list",
        message: "Which employee role do you want to update?",
        name: "empName",
        choices: employees,
      },
      {
        type: "list",
        message: "Which role do you want to assign to the selected employee?",
        name: "roleName",
        choices: roleName,
      },
    ]);
    console.log(data.empName);
    await query(`UPDATE employee SET role_id = ? WHERE employee.id = ?`, [
      data.roleName,
      data.empName,
    ]);
    console.log("Updated employee's role");
    await start();
  } catch (err) {
    console.log(err);
  }
};

function quit() {
  process.exit();
}
start();
