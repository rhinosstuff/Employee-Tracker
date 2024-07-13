const pool = require('../config/connection')
const inquirer = require('inquirer')

const employeeNames = async () => {
  try {
    const result = await pool.query('SELECT * FROM employees')
    const names = result.rows.map(({ first_name, last_name }) => `${first_name} ${last_name}`)
    names.unshift('None')
    return names
  } catch (error) {
    console.error('Error retrieving departments:', error)
    throw error
  }
}

const roleTitles = async () => {
  try {
    const result = await pool.query('SELECT * FROM roles')
    const titles = result.rows.map(({ title }) => title)
    return titles
  } catch (error) {
    console.error('Error retrieving departments:', error)
    throw error
  }
}

const departmentNames = async () => {
  try {
    const result = await pool.query('SELECT * FROM departments')
    const names = result.rows.map(({ name }) => name)
    return names
  } catch (error) {
    console.error('Error retrieving departments:', error)
    throw error
  }
}

const addEmployeePrompt = [
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
    name: 'role',
    choices: roleTitles
  },
  {
    type: 'list',
    message: `Who is the employee's manager?`,
    name: 'manager',
    choices: employeeNames
  }
]

const addRolePrompt = [
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
    choices: departmentNames
  }
]

const addDepartmentPrompt = [
  {
    type: 'input',
    message: `What is the name of the department?`,
    name: 'name',
    validate: function(input) {
      return input.trim() ? true : 'Please enter a name.'
    }
  }
]

async function addEmployee() {
  try {
    const choice = await inquirer.prompt(addEmployeePrompt)
    
    const roleQuery = `SELECT id FROM roles WHERE title = $1`
    const role = await pool.query(roleQuery, [choice.role])
    const role_id = role.rows[0].id

    let manager_id = null
    if (choice.manager !== 'None') {
      const managerQuery = `SELECT id FROM employees WHERE first_name = $1 AND last_name = $2`
      const [manager_first, manager_last] = choice.manager.split(' ')
      const manager = await pool.query(managerQuery, [manager_first, manager_last])
      manager_id = manager.rows[0].id
    }

    const insertEmployeeQuery = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`
    await pool.query(insertEmployeeQuery, [choice.first_name, choice.last_name, role_id, manager_id])
    console.log(`Employee (${choice.first_name} ${choice.last_name}) added successfully!\n`)
  }
  catch (error) {
    console.error('Error executing query', error)
  }
}

async function addRole() {
  try {
    const choice = await inquirer.prompt(addRolePrompt)

    const departmentQuery = `SELECT id FROM departments WHERE name = $1`
    const department = await pool.query(departmentQuery, [choice.department])
    const department_id = department.rows[0].id

    const insertRole = `INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)`
    await pool.query(insertRole, [choice.title, choice.salary, department_id])
    console.log(`Role (${choice.title}) added successfully!\n`)
  }
  catch (error) {
    console.error('Error executing query', error)
  }
}

async function addDepartment() {
  try {
    const choice = await inquirer.prompt(addDepartmentPrompt)

    const insertDepartment = `INSERT INTO departments (name) VALUES ($1)`
    await pool.query(insertDepartment, [choice.name])
    console.log(`Department (${choice.name}) added successfully!\n`)
  }
  catch (error) {
    console.error('Error executing query', error)
  }
}

module.exports = { addEmployee, addRole, addDepartment }