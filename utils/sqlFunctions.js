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

function getDepartments(){
    db.query(`SELECT name FROM departments`, (err, rows) => {
        if(err) {
            console.log(err);
        }
        return rows;
    })
}

module.exports = {getDepartments}