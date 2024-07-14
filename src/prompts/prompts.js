// Dependencies
const { employeeNames, roleTitles, departmentNames } = require('../queries/queryPrompts')
const inquirer = require('inquirer')

// Displays the main questions the user will choose from
const mainPrompt = async () => {
  const response = await inquirer.prompt([
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
        'Add Department',
        'Exit']
    }
  ])
  return response
}

// Retrieves user selection for the addEmployee query
const addEmployeePrompt = async () => {
  let names = await employeeNames()
  // Adding 'None' as the first element by using the spread operator
  names = ['None', ...names]

  const response = await inquirer.prompt([
    {
      type: 'input',
      message: `What is the employee's first name?`,
      name: 'first_name',
      validate: function(input) {
        return input.trim() ? true : 'Please enter a first name.'
      }
    },
    {
      type: 'input',
      message: `What is the employee's last name?`,
      name: 'last_name',
      validate: function(input) {
        return input.trim() ? true : 'Please enter a last name.'
      }
    },
    {
      type: 'list',
      message: `What is the employee's role?`,
      name: 'title',
      // Displays current list of all roles for title selection
      choices: roleTitles
    },
    {
      type: 'list',
      message: `Who is the employee's manager?`,
      name: 'manager',
      // Displays current list of all employees for manager selection
      choices: names
    }
  ])
  return response
}

// Retrieves user selection for the addRole query
const addRolePrompt = async () => {
  const response = await inquirer.prompt([
    {
      type: 'input',
      message: `What is the title of the role?`,
      name: 'title',
      validate: function(input) {
        return input.trim() ? true : 'Please enter a title.'
      }
    },
    {
      type: 'input',
      message: `What is the salary of the role?`,
      name: 'salary',
      validate: function(input) {
        const isNumber = !isNaN(input) && input.trim() !== '';
        return isNumber ? true : 'Please enter a valid number for the salary.';
      }
    },
    {
      type: 'list',
      message: `What department does this role belong to?`,
      name: 'department',
      // Displays current list of all departments for department selection
      choices: departmentNames
    }
  ])
  return response
}

// Retrieves user selection for the addDepartment query
const addDepartmentPrompt = async () => {
  const response = await inquirer.prompt([
    {
      type: 'input',
      message: `What is the name of the department?`,
      name: 'name',
      validate: function(input) {
        return input.trim() ? true : 'Please enter a name.'
      }
    }
  ])
  return response
}

// Retrieves user selection for the updateEmployee query
const updateEmployeePrompt = async () => {
  const response = await inquirer.prompt([
    {
      type: 'list',
      message: `Which employee's role do you want to update?`,
      name: 'name',
      // Displays current list of all employees for manager selection
      choices: employeeNames
    },
    {
      type: 'list',
      message: `Which role do you want to assign the selected employee?`,
      name: 'title',
      // Displays current list of all roles for title selection
      choices: roleTitles
    }
  ])
  return response
}

module.exports = { mainPrompt, addEmployeePrompt, addRolePrompt, addDepartmentPrompt, updateEmployeePrompt }