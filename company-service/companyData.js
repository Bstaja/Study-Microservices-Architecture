const companies = [
    { id: 1, name: 'TestCompany' },
];
  
function findCompany(name) {
    return companies.find(u => u.name === name);
}
  
module.exports = { findCompany };