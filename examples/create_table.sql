CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    salary DECIMAL DEFAULT 50000,
    hire_date DATE NOT NULL,
    department_id INT REFERENCES departments(id),
    is_active BOOLEAN DEFAULT TRUE
);