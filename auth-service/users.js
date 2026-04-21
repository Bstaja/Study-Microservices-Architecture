const users = [
    { id: 1, username: 'user', password: 'user123' }
  ];
  
  function findUser(username, password) {
    return users.find(u => u.username === username && u.password === password);
  }
  
  module.exports = { findUser };
  