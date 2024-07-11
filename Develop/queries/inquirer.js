const inquirer = require('inquirer')
const pool = require('../config/connection');


// prompts the user through a series of selections and questions
function prompts() {
  inquirer
  .prompt([
    {
      type: 'list',
      message: `What would you like to do?`,
      name: 'selection',
      choices: [
        'View All Employees', 
        'Add Employee', 
        'Update Employee Role', 
        'View All Roles', 
        'Add Role', 
        'View All Departments',
        'Add Department']
    }
  ])
  .then((choice) => {
    switch (choice.selection) {
      case 'View All Employees':
        pool.query('select * from employees', (error, results) => {console.table(results.rows)})
        break;
    }
  })
}

// validate: function(input) {
//   return input ? true : 'Please enter a color'
// }

module.exports = { prompts }