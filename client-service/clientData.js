const clients = [
    { id: 1, name: 'John' },
];
  
function findClient(name) {
    return clients.find(u => u.name === name);
}
  
module.exports = { findClient };