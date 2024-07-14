const pool = require('../config/connection')
const { addEmployeePrompt, addRolePrompt, addDepartmentPrompt } = require('./prompts')

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
      manager: row.manager.trim() ? row.manager : 'null'
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

const addEmployee = async () => {
  try {
    const employee = await addEmployeePrompt()
    
    const roleQuery = `SELECT id FROM roles WHERE title = $1`
    const role = await pool.query(roleQuery, [employee.role])
    const role_id = role.rows[0].id

    let manager_id = null
    if (employee.manager !== 'None') {
      const managerQuery = `SELECT id FROM employees WHERE first_name = $1 AND last_name = $2`
      const [manager_first, manager_last] = employee.manager.split(' ')
      const manager = await pool.query(managerQuery, [manager_first, manager_last])
      manager_id = manager.rows[0].id
    }

    const insertEmployeeQuery = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`
    await pool.query(insertEmployeeQuery, [employee.first_name, employee.last_name, role_id, manager_id])
    console.log(`Employee (${employee.first_name} ${employee.last_name}) added successfully!\n`)
  }
  catch (error) {
    console.error('Error executing query', error)
  }
}

const addRole = async () => {
  try {
    const role = await addRolePrompt()

    const departmentQuery = `SELECT id FROM departments WHERE name = $1`
    const department = await pool.query(departmentQuery, [role.department])
    const department_id = department.rows[0].id

    const insertRole = `INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)`
    await pool.query(insertRole, [role.title, role.salary, department_id])
    console.log(`Role (${role.title}) added successfully!\n`)
  }
  catch (error) {
    console.error('Error executing query', error)
  }
}

const addDepartment = async () => {
  try {
    const department = await addDepartmentPrompt()

    const insertDepartment = `INSERT INTO departments (name) VALUES ($1)`
    await pool.query(insertDepartment, [department.name])
    console.log(`Department (${department.name}) added successfully!\n`)
  }
  catch (error) {
    console.error('Error executing query', error)
  }
}

module.exports = { viewEmployees, viewRoles, viewDepartments, addEmployee, addRole, addDepartment }