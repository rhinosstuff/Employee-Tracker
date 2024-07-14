const { mainPrompt } = require('./prompts/prompts')
const { viewEmployees, viewRoles, viewDepartments, addEmployee, addRole, addDepartment, updateEmployee } = require('./queries/queries')

const init = async () => {
  const response = await mainPrompt()
  await main(response)
}

// prompts the user through a series of selections and questions
const main = async (response) => {
  try {
    switch (response.selection) {
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
      case 'Update Employee Role':
        await updateEmployee()
        break
    } 
  } catch (error) {
    console.error('Error in prompts:', error)
  } finally {
    init()
  }
}

module.exports = { init }