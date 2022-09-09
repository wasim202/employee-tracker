INSERT INTO department (id, name)
VALUES(1, "Sales")
      (2, "Engineering"),
      (3, "Finance"),
      (4, "Legal");

INSERT INTO role (id, title, salary, department_id)
VALUES (001, "Sales Lead" , 100000, 001),
       (002, "Salesperson" , 80000, 001),
       (003, "Lead Engineer" , 150000, 002),
       (004, "Softear Engineer" , 120000, 002),
       (005, "Account Manager" , 160000, 003),
       (006, "Accoutanct" , 125000, 003),
       (007, "Legal Team Lead" , 250000, 004),
       (008, "Lawyer", 190000, 004);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (001, "John" , "Doe", NULL),
       (002, "Mike" , "Chan", "John Doe"),
       (003, "Ashley" , "Rodriguz", NULL),
       (004, "Kevin" , "Tupik", "Ashley Rodriguez"),
       (005, "Kunal" , "Singh", NULL),
       (006, "Malia" , "Brown", "Kunal Singh"),
       (007, "Sarah" , "Lourd", NULL),
       (008, "Tom" , "Allen", "Sarah Lourd");
