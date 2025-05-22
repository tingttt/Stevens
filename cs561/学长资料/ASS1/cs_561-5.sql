with c1 as (
select cust, prod, max(quant) maxq, s.state
from sales s
	where state = 'NY'
	group by cust, prod, s.state
), c2 as (
select cust, prod, max(quant) maxq, s.state
from sales s
	where state = 'NJ'
	group by cust, prod, s.state
), c3 as (
select cust, prod, max(quant) maxq, s.state
from sales s
	where state = 'CT'
	group by cust, prod, s.state
)
--missing query here
-- select c1.cust, c1.prod, c1.maxq, c1.state, s.date, c2.maxq, c2.state, s.date, c3.maxq, c3.state, s.date
-- from c1, c2, c3, sales s
-- where c1.cust = c2.cust and c2.cust = c3.cust and c1.prod = c2.prod and c2.prod = c3.prod
-- and c1.maxq = s.quant and c2.maxq = s.quant and c3.maxq = s.quant



select * from c3