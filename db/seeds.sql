INSERT INTO department (name)
VALUES( "Sales"),
      ( "Engineering"),
      ("Finance"),
      ( "Legal");

INSERT INTO role ( title, salary, department_id)
VALUES ( "Sales Lead" , 100000, 1),
       ( "Salesperson" , 80000, 1),
       ( "Lead Engineer" , 150000, 2),
       ( "Softear Engineer" , 120000, 2),
       ( "Account Manager" , 160000, 3),
       ( "Accoutanct" , 125000, 3),
       ("Legal Team Lead" , 250000, 4),
       ( "Lawyer", 190000, 4);

INSERT INTO employee ( first_name, last_name, role_id, manager_id)
VALUES ( "John" , "Doe",7, NULL),
       ( "Mike" , "Chan",8, 1),
       ("Ashley" , "Rodriguz",1, NULL),
       ( "Kevin" , "Tupik",2, 3),
       ( "Kunal" , "Singh",3, NULL),
       ( "Malia" , "Brown",4, 5),
       ( "Sarah" , "Lourd",5, NULL),
       ( "Tom" , "Allen",6, 7);
