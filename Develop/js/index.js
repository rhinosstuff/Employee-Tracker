const inquirer = require('inquirer')
const { viewEmployees, viewRoles, viewDepartments } = require('./queriesView')
const { addEmployee, addRole, addDepartment } = require('./queriesAdd')

function mainPrompt() {
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
    prompts(choice.selection)
  })
}

// prompts the user through a series of selections and questions
async function prompts(choice) {
  try {
    switch (choice) {
      case 'View All Employees':
        await viewEmployees()
        break
      case 'View All Roles':
        await viewRoles()
        break
      case 'View All Departments':
        await viewDepartments()
        break
      case 'Add Employee':
          await addEmployee()
          break
      case 'Add Role':
        await addRole()
        break
      case 'Add Department':
        await addDepartment()
        break 
    } 
  } catch (error) {
    console.error('Error in prompts:', error);
  } finally {
    mainPrompt()
  }
}

module.exports = { mainPrompt }