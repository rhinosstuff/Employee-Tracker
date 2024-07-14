// Dependencies
const { mainPrompt } = require('./prompts/prompts')
const { viewEmployees, viewRoles, viewDepartments, addEmployee, addRole, addDepartment, updateEmployee } = require('./queries/queries')

// Initializes application presentig user with the mainPrompt()
const init = async () => {
  const response = await mainPrompt()
  await main(response)
}

// Calls modules based on user selection from the mainPrompt()
// After a module has processed, main() will loop by calling init() 
// If user selects 'Exit', it will exit the process
const main = async (response) => {
  try {
    switch (response.selection) {
      case 'View All Employees':
        await viewEmployees()
        break
      case 'Add Employee':
        await addEmployee()
        break
      case 'Update Employee Role':
        await updateEmployee()
        break
      case 'View All Roles':
        await viewRoles()
        break
      case 'Add Role':
        await addRole()
        break
      case 'View All Departments':
        await viewDepartments()
        break
      case 'Add Department':
        await addDepartment()
        break
      case 'Exit':
        process.exit()
    } 
  } catch (error) {
    console.error('Error in prompts:', error)
  } finally {
    init()
  }
}

// Exporting to server.js to start the program
module.exports = { init }