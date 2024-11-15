SELECT 
    d.department_name,
    COUNT(*) AS employee_count,
    AVG(e.salary) AS avg_salary,
    MAX(e.hire_date) AS latest_hire
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
WHERE e.salary > 50000 
    AND e.hire_date >= '2022-01-01'
    AND (e.first_name LIKE 'J%' OR e.last_name LIKE 'S%')
GROUP BY d.department_name
HAVING COUNT(*) > 5
ORDER BY avg_salary DESC
LIMIT 5;