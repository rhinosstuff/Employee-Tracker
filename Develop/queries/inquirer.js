const inquirer = require('inquirer')
const pool = require('../config/connection')
const { mainPrompt, viewEmployees, viewRoles, viewDepartments, addDepartmentPrompt } = require('./queries')

function displayMainPrompt() {
  inquirer
  .prompt(mainPrompt)
  .then((choice) => {
    prompts(choice.selection)
  })
}

function displayAddDepartment() {
  inquirer
  .prompt(addDepartmentPrompt)
  .then((choice) => {
    try {
      pool.query(`INSERT INTO departments (name) VALUES ('${choice.name}')`);
      console.log('Department added successfully!');
    }
    catch (error) {
      console.error('Error executing query', error);
    }
  })
}

// prompts the user through a series of selections and questions
function prompts(choice) {
  switch (choice) {
    case 'View All Employees':
      viewEmployees().then(displayMainPrompt)
    break
    case 'View All Roles':
      viewRoles().then(displayMainPrompt)
    break
    case 'View All Departments':
      viewDepartments().then(displayMainPrompt)
    break
    case 'Add Department':
      displayAddDepartment()
    break
  }
  
}

// validate: function(input) {
//   return input ? true : 'Please enter a color'
// }

module.exports = { displayMainPrompt }