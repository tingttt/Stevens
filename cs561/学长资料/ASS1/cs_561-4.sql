with q1 as (
select cust, prod, avg(quant) q1avg
	from sales
	where month in(1,2,3)
	group by cust, prod
), q2 as (
select cust, prod, avg(quant) q1avg
	from sales
	where month in(4,5,6)
	group by cust, prod
), q3 as (
select cust, prod, avg(quant) q1avg
	from sales
	where month in(7,8,9)
	group by cust, prod
),q4 as (
select cust, prod, avg(quant) q1avg
	from sales
	where month in(10,11,12)
	group by cust, prod
), overall as (
select cust, prod, avg(quant) q1avg
	from sales
	group by cust, prod
)
SELECT q1.cust, q1.prod, q1.q1avg, q2.q1avg as q2avg, q3.q1avg as q3avg, q4.q1avg as q4avg, overall.q1avg as overallavg
FROM q1
JOIN q2 ON q1.cust = q2.cust AND q1.prod = q2.prod
JOIN q3 ON q1.cust = q3.cust AND q1.prod = q3.prod
JOIN q4 ON q1.cust = q4.cust AND q1.prod = q4.prod
JOIN overall ON q1.cust = overall.cust AND q1.prod = overall.prod;
