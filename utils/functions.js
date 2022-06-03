const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Moogi1500!',
        database: 'company'
    },
    console.log('Connected to the election database')
);

const initialQuestions = [
    {
        type: 'list',
        name: 'initial',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            "View all employees",
            'Add a department',
            'Add a role',
            'Add a employee',
            "Update an employee",
            "I'm finished"
        ]
    }
];


async function masterSelection(){
    await inquirer.prompt(initialQuestions)
    .then((answers) => {
        if(answers.initial === 'View all departments'){
            viewDepartments();
        } else if(answers.initial === 'View all roles'){
            viewRoles();
        } else if(answers.initial === 'View all employees'){
            viewEmployees();
        } else if(answers.initial === 'Add a department'){
            addDepartment();
        } else if(answers.initial === 'Add a role'){
            addRole();
        } else if(answers.initial === 'Add a employee'){
            addEmployee();
        } else if(answers.initial === 'Update an employee'){
            updateEmployee();
        } else if(answers.initial === "I'm finished"){
            return;
        }
    });
}

async function viewDepartments(){
    db.query(`SELECT name FROM departments`, (err, rows) => {
        if(err) {
            console.log(err);
        }
        console.table(rows);
    })

    masterSelection();
}

async function viewRoles(){
    db.query(`SELECT title, salary FROM roles`, (err, rows) => {
        if(err) {
            console.log(err);
        }
        console.table(rows);
    })

    masterSelection();
}

async function viewEmployees(){
    db.query(`SELECT first_name, last_name, roles.title, roles.salary FROM employees 
    LEFT JOIN roles ON employees.role_id = roles.id`, (err, rows) => {
        if(err) {
            console.log(err);
        }
        console.table(rows);
    })

    masterSelection();
}

async function addDepartment(){
    const departmentQ = [
        {
            type: 'input',
            name: 'name',
            message: 'Enter department name.'
        }
    ]
    await inquirer.prompt(departmentQ)
    .then((answers) => {
        const params = [answers.name];

        db.query(`INSERT INTO departments (name) VALUES (?)`, params, (err, rows) => {
            if(err) {
                console.log(err);
            }
            console.log('Department added');
            masterSelection();
        })
    });

}
async function addRole(){
    db.query(`SELECT * FROM departments`, (err, rows) => {
        if(err) {
            console.log(err);
        }
        let databaseNames = rows.map(element => element.name);
        let rolesQ = [
            {
                type: 'input',
                name: 'title',
                message: 'Enter role title.'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter salary amount.'
            },
            {
                type: 'list',
                name: 'department',
                message: 'Choose department.',
                choices: databaseNames
            }
        ]

        inquirer.prompt(rolesQ)
        .then((answers) => {
            rows.forEach((element, index) => {
                if(element.name === answers.department){
                    answers.department = element.id;
                }
            });
            const params = [answers.title, answers.salary, answers.department];

            db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`, params, (err, rows) => {
                if(err) {
                    console.log(err);
                }
                console.log('Role added');
                masterSelection();
            })
        });    
    })
}

async function addEmployee(){
    db.query(`SELECT * FROM roles`, (err, rows) => {
        if(err) {
            console.log(err);
        }
        let databaseNames = rows.map(element => element.title);
        let employeeQ = [
            {
                type: 'input',
                name: 'firstName',
                message: 'Enter employees first name.'
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'Enter employees last name.'
            },
            {
                type: 'list',
                name: 'roles',
                message: 'Choose role.',
                choices: databaseNames
            }
        ]

        inquirer.prompt(employeeQ)
        .then((answers) => {
            rows.forEach((element, index) => {
                if(element.title === answers.roles){
                    answers.roles = element.id;
                }
            });
            const params = [answers.firstName, answers.lastName, answers.roles];

            db.query(`INSERT INTO employees (first_name, last_name, role_id) VALUES (?,?,?)`, params, (err, rows) => {
                if(err) {
                    console.log(err);
                }
                console.log('Employee added');
                masterSelection();
            })
        });    
    })
}

async function updateEmployee(){
    db.query(`SELECT * FROM roles`, (err, rows) => {
        if(err) {
            console.log(err);
        }
        let databaseNames = rows.map(element => element.title);
        let employeeNames;

        db.query(`SELECT * FROM employees`, (err, results) => {
            if(err) {
                console.log(err);
            }
            employeeNames = results.map(element => {
                let name = element.first_name + " " + element.last_name;
                return name;
            })
            console.log(employeeNames);

            let employeeQ = [
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Choose employee.',
                    choices: employeeNames
                },
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Enter employees first name.'
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Enter employees last name.'
                },
                {
                    type: 'list',
                    name: 'roles',
                    message: 'Choose role.',
                    choices: databaseNames
                }
            ]

            inquirer.prompt(employeeQ)
            .then((answers) => {
                rows.forEach((element) => {
                    if(element.title === answers.roles){
                        answers.roles = element.id;
                    }
                });
                results.forEach((element) => {
                    if(element.first_name + " " + element.last_name === answers.employee){
                        answers.employee = element.id
                    }
                });

                const params = [answers.firstName, answers.lastName, answers.roles, answers.employee];

                db.query(`UPDATE employees SET first_name = ?, last_name = ?, role_id = ?
                WHERE id = ?`, params, (err, rows) => {
                    if(err) {
                        console.log(err);
                    }
                    console.log('Employee updated');
                    masterSelection();
                });
            });      
        });
    });
}

module.exports = {masterSelection, viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployee};