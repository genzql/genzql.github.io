SELECT first_name, last_name, salary AS annual_pay
FROM employees
WHERE department_id = 100
GROUP BY department_id
HAVING AVG(salary) > 50000
ORDER BY last_name DESC
LIMIT 10;