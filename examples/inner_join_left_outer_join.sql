SELECT e.first_name, e.last_name, d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
LEFT OUTER JOIN locations l ON d.location_id = l.id;