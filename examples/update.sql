UPDATE employees 
SET salary = salary * 1.1,
    last_modified = CURRENT_TIMESTAMP
WHERE department_id = 100;