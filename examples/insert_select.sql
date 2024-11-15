INSERT INTO employee_archive
SELECT * FROM employees
WHERE termination_date IS NOT NULL;