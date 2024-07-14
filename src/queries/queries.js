// Dependencies
const pool = require('../config/connection')
const { addEmployeePrompt, addRolePrompt, addDepartmentPrompt, updateEmployeePrompt } = require('../prompts/prompts')

// Retrieves employee id based on user selection of employee name
const getEmployeeByName = async (name) => {
  const employeeQuery = `SELECT id FROM employees WHERE first_name = $1 AND last_name = $2`
  const [first_name, last_name] = name.split(' ')
  const employeeResult = await pool.query(employeeQuery, [first_name, last_name])
  const employee_id = employeeResult.rows[0].id
  return employee_id
}

// Retrieves role id based on user selection of role title
const getRoleByTitle = async (title) => {
  const roleQuery = `SELECT id FROM roles WHERE title = $1`
  const role = await pool.query(roleQuery, [title])
  const role_id = role.rows[0].id
  return role_id
}

// Retrieves list of employees and joins roles and departments for display
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

// Retrieves list of roles and joins departments for display
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

// Retrieves list of departments
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

// Adds employee to the database
const addEmployee = async () => {
  try {
    // Retrieve employee information based on user input
    const employee = await addEmployeePrompt()
    
    // Retrieve role ID based on title
    const role_id = await getRoleByTitle(employee.title)
    
    let manager_id = null
    // If manager selection is not 'None', retrieve manager ID based on name
    if (employee.manager !== 'None') {
      manager_id = await getEmployeeByName(employee.manager)
    }

    // Query to insert employee into the database
    const insertEmployeeQuery = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`
    await pool.query(insertEmployeeQuery, [employee.first_name, employee.last_name, role_id, manager_id])

    console.log(`Employee (${employee.first_name} ${employee.last_name}) added successfully!\n`)
  }
  catch (error) {
    console.error('Error executing query', error)
  }
}

// Adds role to the database
const addRole = async () => {
  try {
    // Retrieve role information based on user input
    const role = await addRolePrompt()

    // Retrieve department ID based on name
    const departmentQuery = `SELECT id FROM departments WHERE name = $1`
    const department = await pool.query(departmentQuery, [role.department])
    const department_id = department.rows[0].id

    // Query to insert role into the database
    const insertRole = `INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)`
    await pool.query(insertRole, [role.title, role.salary, department_id])

    console.log(`Role (${role.title}) added successfully!\n`)
  }
  catch (error) {
    console.error('Error executing query', error)
  }
}

// Adds department to the database
const addDepartment = async () => {
  try {
    // Retrieve department information based on user input
    const department = await addDepartmentPrompt()

    // Query to insert department into the database
    const insertDepartment = `INSERT INTO departments (name) VALUES ($1)`
    await pool.query(insertDepartment, [department.name])

    console.log(`Department (${department.name}) added successfully!\n`)
  }
  catch (error) {
    console.error('Error executing query', error)
  }
}

// Updates employee role in the database
const updateEmployee = async () => {
  try {
    // Retrieve employee information based on user input
    const employee = await updateEmployeePrompt()
    
    const role_id = await getRoleByTitle(employee.title)
    const employee_id = await getEmployeeByName(employee.name)

    // Query to update employee role ID in database
    const updateEmployeeQuery = `UPDATE employees SET role_id = $2 WHERE id = $1`
    await pool.query(updateEmployeeQuery, [employee_id, role_id])

    console.log(`Updated role for (${employee.name}) to (${employee.title}) successfully!\n`)
  }
  catch (error) {
    console.error('Error executing query', error)
  }
}

module.exports = { viewEmployees, viewRoles, viewDepartments, addEmployee, addRole, addDepartment, updateEmployee }