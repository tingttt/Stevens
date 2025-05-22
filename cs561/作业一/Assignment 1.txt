-- JUNHE JIAO
-- 20031937

-- select * from sales;

-- 1 --
WITH t1(CUSTOMER, MIN_Q, MAX_Q, AVG_Q) AS (
SELECT cust, min(quant), max(quant), round(avg(quant))
FROM sales
GROUP BY cust
),
t2(CUSTOMER, MIN_Q, MIN_PROD, MIN_DATE, MIN_ST) AS (
SELECT CUSTOMER, MIN_Q, prod, date, state
FROM t1, sales
WHERE t1.CUSTOMER = sales.cust AND t1.MIN_Q = sales.quant
),
t3(CUSTOMER, MAX_Q, MAX_PROD, MAX_DATE, MAX_ST) AS (
SELECT CUSTOMER, MAX_Q, prod, date, state
FROM t1, sales
WHERE t1.CUSTOMER = sales.cust AND t1.MAX_Q = sales.quant
)
SELECT CUSTOMER, MIN_Q, MIN_PROD, MIN_DATE, MIN_ST ST, MAX_Q, MAX_PROD, MAX_DATE, MAX_ST ST, AVG_Q
FROM t1 NATURAL JOIN t2 NATURAL JOIN t3;

-- 2 --
WITH sum AS(
SELECT YEAR, month, sum(quant)
FROM sales
GROUP BY year, month
),
t1 AS(
SELECT YEAR, max(sum) BUSIEST_TOTAL_Q 
FROM sum
GROUP BY year
),
t2 AS(
SELECT t1.YEAR, month BUSIEST_MONTH, BUSIEST_TOTAL_Q 
FROM sum, t1
WHERE sum.sum = t1.BUSIEST_TOTAL_Q AND sum.year = t1.year
),
t3 AS(
SELECT YEAR, min(sum) SLOWEST_TOTAL_Q 
FROM sum
GROUP BY year
),
t4 AS(
SELECT t3.YEAR, month SLOWEST_MONTH, SLOWEST_TOTAL_Q 
FROM sum, t3
WHERE sum.sum = t3.SLOWEST_TOTAL_Q AND sum.year = t3.year
)
SELECT YEAR, BUSIEST_MONTH, BUSIEST_TOTAL_Q, SLOWEST_MONTH, SLOWEST_TOTAL_Q
FROM t2 NATURAL JOIN t4
ORDER BY YEAR;

-- 3 --
WITH sum AS(
SELECT prod PRODUCT, month, sum(quant)
FROM sales
GROUP BY prod, month
),
t1 AS(
SELECT PRODUCT, max(sum) MOST_Q 
FROM sum
GROUP BY PRODUCT
),
t2 AS(
SELECT t1.PRODUCT, month MOST_FAV_MO, MOST_Q 
FROM sum, t1
WHERE sum.sum = t1.MOST_Q AND sum.PRODUCT = t1.PRODUCT
),
t3 AS(
SELECT PRODUCT, min(sum) LEAST_Q 
FROM sum
GROUP BY PRODUCT
),
t4 AS(
SELECT t3.PRODUCT, month LEAST_FAV_MO, LEAST_Q 
FROM sum, t3
WHERE sum.sum = t3.LEAST_Q AND sum.PRODUCT = t3.PRODUCT
)
SELECT PRODUCT, MOST_FAV_MO, LEAST_FAV_MO
FROM t2 NATURAL JOIN t4
ORDER BY PRODUCT;

-- 4 --
WITH t1(CUSTOMER, PRODUCT, AVERAGE, TOTAL, COUNT) AS(
SELECT cust, prod, round(avg(quant)), sum(quant), count(quant)
FROM sales
GROUP BY cust, prod
),
spring(CUSTOMER, PRODUCT, SPRING_AVG) AS(
SELECT cust, prod, round(avg(quant))
FROM sales
WHERE month=3 OR month=4 OR month=5
GROUP BY cust, prod
),
summer(CUSTOMER, PRODUCT, SUMMER_AVG) AS(
SELECT cust, prod, round(avg(quant))
FROM sales
WHERE month=6 OR month=7 OR month=8
GROUP BY cust, prod
),
fall(CUSTOMER, PRODUCT, FALL_AVG) AS(
SELECT cust, prod, round(avg(quant))
FROM sales
WHERE month=9 OR month=10 OR month=11
GROUP BY cust, prod
),
winter(CUSTOMER, PRODUCT, WINTER_AVG) AS(
SELECT cust, prod, round(avg(quant))
FROM sales
WHERE month=12 OR month=1 OR month=2
GROUP BY cust, prod
)
SELECT CUSTOMER, PRODUCT, SPRING_AVG, SUMMER_AVG, FALL_AVG, WINTER_AVG, AVERAGE, TOTAL, COUNT
FROM t1 NATURAL JOIN spring NATURAL JOIN summer NATURAL JOIN fall NATURAL JOIN winter;

-- 5 --
with t1(PRODUCT, Q1_MAX) AS(
SELECT prod, max(quant)
FROM sales
WHERE month=1 OR month=2 OR month=3
GROUP BY prod
),
Q1(PRODUCT, Q1_MAX, Q1_DATE) AS(
SELECT PRODUCT, Q1_MAX, sales.date
FROM sales, t1
WHERE sales.prod = t1.PRODUCT AND sales.quant = t1.Q1_MAX AND
(month=1 OR month=2 OR month=3)
),
t2(PRODUCT, Q2_MAX) AS(
SELECT prod, max(quant)
FROM sales
WHERE month=4 OR month=5 OR month=6
GROUP BY prod
),
Q2(PRODUCT, Q2_MAX, Q2_DATE) AS(
SELECT PRODUCT, Q2_MAX, sales.date
FROM sales, t2
WHERE sales.prod = t2.PRODUCT AND sales.quant = t2.Q2_MAX AND
(month=4 OR month=5 OR month=6)
),
t3(PRODUCT, Q3_MAX) AS(
SELECT prod, max(quant)
FROM sales
WHERE month=7 OR month=8 OR month=9
GROUP BY prod
),
Q3(PRODUCT, Q3_MAX, Q3_DATE) AS(
SELECT PRODUCT, Q3_MAX, sales.date
FROM sales, t3
WHERE sales.prod = t3.PRODUCT AND sales.quant = t3.Q3_MAX AND
(month=7 OR month=8 OR month=9)
),
t4(PRODUCT, Q4_MAX) AS(
SELECT prod, max(quant)
FROM sales
WHERE month=10 OR month=11 OR month=12
GROUP BY prod
),
Q4(PRODUCT, Q4_MAX, Q4_DATE) AS(
SELECT PRODUCT, Q4_MAX, sales.date
FROM sales, t4
WHERE sales.prod = t4.PRODUCT AND sales.quant = t4.Q4_MAX AND
(month=10 OR month=11 OR month=12)
)
SELECT PRODUCT, Q1_MAX, Q1_DATE DATE, Q2_MAX, Q2_DATE DATE, Q3_MAX, Q3_DATE DATE, Q4_MAX, Q4_DATE DATE
FROM q1 NATURAL JOIN q2 NATURAL JOIN q3 NATURAL JOIN q4;
