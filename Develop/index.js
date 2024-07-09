const inquirer = require('inquirer')
const { Pool } = require('pg')

// prompts the user through a series of selections and questions
function init() {
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
  .then((data) => {
    // Provides the directory path and creates .svg file name based off the user input text 
    const filename = `./examples/${data.text}.svg`
    writeToFile(filename, data)
  })
}

// validate: function(input) {
//   return input ? true : 'Please enter a color'
// }

init()