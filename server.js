const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql')

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "UrSecureP@s$word",
    database: "employees_db"
});

connection.connect(function (err) {
    if (err) {
        console.error("There was an error when trying to connect.");
        return;
    }
});

getJob();

function getJob() {
    inquirer
        .prompt(
          {
            name: 'job',
            type: 'list',
            message: 'Please select from the following choices:',
            choices: ['add', 'view', 'updated', 'exit'],
          })
        .then(function ({ job }) {
            switch (job) {
                case 'add':
                    add();
                    break;
                case 'view':
                    view();
                    break;
                case 'update':
                    update();
                    break;
                case 'exit':
                    connection.end()
                    return;
            }
        })
    }

function add() {
    inquirer
        .prompt(
          {
            name: 'db',
            message: 'What are you looking to add?',
            type: 'list',
            choices: ['department', 'role', 'employee'],
          })
        .then(function ({ db }) {
            switch (db) {
                case 'department':
                    add_department()
                    break;
                case 'role':
                    add_role()
                    break;
                case 'employee':
                    add_employee()
                    break;
            }
        })
    }

function add_department() {
    inquirer
        .prompt(
          {
            name: 'name',
            message: 'What is the name of the department?',
            input: 'input'
          })
        .then(function ({ name }) {
            connection.query(`INSERT INTO department (name) VALUES ('${name})`, function (err, data) {
                if (err) throw err;
                console.log('The department name has been added.')
                getJob();
            })
        })
    }

function add_role() {
    let departments = []
    
    connection.query(`SELECT * FROM department`, function (err, data) {
        if (err) throw err;
    
        for (let i = 0; i < data.length; i++) { 
            departments.push(data[i].name)}
    
    inquirer
        .prompt([
          {
            name: 'title',
            message: "What is their role?",
            type: 'input'
          },
          {
            name: 'salary',
            message: 'What is their yearly salary?',
            type: 'input'
          },
          {
            name: 'department_id',
            message: 'What department do they belong to?',
            type: 'list',
            choices: departments
          }])
        .then(function ({ title, salary, department_id }) {
            let index = departments.indexOf(department_id)
    
            connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${title}', '${salary}', ${index})`, function (err, data) {
                if (err) throw err;
                console.log(`Added`)
                getJob();
            })
        })
    })
}
