SELECT
  column_a AS a,
  12,
  func(a, b),
  otherFunc(
    a,
    1,
    b,
    2
  ) AS yeah
FROM table_a ace
WHERE (
    a = 1
  ) OR (
    b = 2
  )
LIMIT 5
;