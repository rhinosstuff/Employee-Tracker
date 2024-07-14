// Dependencies
const pool = require('../config/connection')

// Retrieves employee first and last names and returns them as a single string 'first_name last_name'
const employeeNames = async () => {
  try {
    const result = await pool.query('SELECT * FROM employees')
    const names = result.rows.map(({ first_name, last_name }) => `${first_name} ${last_name}`)
    return names
  } catch (error) {
    console.error('Error retrieving departments:', error)
    throw error
  }
}

// Retrieves role title
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

// Retrieves department name
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

module.exports = { employeeNames, roleTitles, departmentNames }