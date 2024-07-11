const inquirer = require('inquirer')
const pool = require('../config/connection')
const cTable = require('console.table')

const mainPrompt = 
  [
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
  ]

const addDepartmentPrompt = 
  [
    {
      type: 'input',
      message: `What is the name of the department?`,
      name: 'name',
      validate: function(input) {
        return input ? true : 'Please enter a name.'
      }
    }
  ]

const viewEmployees = async () => {
  try {
      const query = await pool.query(`
        SELECT 
          e.id, 
          e.first_name, 
          e.last_name, 
          r.title, 
          d.name AS department, 
          r.salary, 
          CONCAT(m.first_name, ' ', m.last_name) AS manager 
        FROM employees e 
        LEFT JOIN roles r ON e.role_id = r.id 
        LEFT JOIN employees m ON e.manager_id = m.id 
        LEFT JOIN departments d ON d.id = r.department_id;
        `)

    const rows = query.rows.map(row => ({
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      title: row.title,
      department: row.department,
      salary: row.salary,
      manager: row.manager
    }))

    console.table(rows)
  } catch (error) {
    console.error(error)
  }
}

const viewRoles = async () => {
  try {
      const query = await pool.query(`
        SELECT 
          r.id,
          r.title, 
          d.name AS department, 
          r.salary
        FROM roles r
        LEFT JOIN departments d ON d.id = r.department_id;
        `)

    const rows = query.rows.map(row => ({
      id: row.id,
      title: row.title,
      department: row.department,
      salary: row.salary
    }))

    console.table(rows)
  } catch (error) {
    console.error(error)
  }
}

const viewDepartments = async () => {
  try {
      const query = await pool.query(`
        SELECT 
          d.id, 
          d.name
        FROM departments d;
        `)

    const rows = query.rows.map(row => ({
      id: row.id,
      name: row.name
    }))

    console.table(rows)
  } catch (error) {
    console.error(error)
  }
}

module.exports = { mainPrompt, viewEmployees, viewRoles, viewDepartments, addDepartmentPrompt }