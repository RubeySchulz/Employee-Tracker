INSERT INTO departments (name)
VALUES ('Accounting'), ('Sales');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Accounting Manager', 100000, 1),
    ('Sales Manager', 120000, 2),
    ('Accountant', 80000, 1),
    ('Salesman', 90000, 2);
    

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Deer', 1, NULL),
    ('Mary', 'Trace', 2, NULL),
    ('Elvis', 'Presley', 3, 1),
    ('Nina', 'Frosley', 4, 2);