with q1 as
(select cust, prod, round(avg(quant)) q1_avg
from sales
where month in (1,2,3)
group by cust, prod)

, q2 as
(select cust, prod, round(avg(quant)) q2_avg
from sales
where month in (4,5,6)
group by cust, prod)

, q3 as
(select cust, prod, round(avg(quant)) q3_avg
from sales
where month in (7,8,9)
group by cust, prod)


, q4 as
(select cust, prod, round(avg(quant)) q4_avg
from sales
where month in (10,11,12)
group by cust, prod)

,q5 as 
(select cust, prod, round(avg(quant)) average, sum(quant) total, count(cust)
from sales
group by cust, prod)

-- select * from q5

select * from q1 natural join q2 natural join q3 natural join q4 natural join q5
order by cust desc,prod