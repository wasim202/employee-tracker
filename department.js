class Department {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
  getRole() {
    return "department";
  }
}

module.exports = Department;
