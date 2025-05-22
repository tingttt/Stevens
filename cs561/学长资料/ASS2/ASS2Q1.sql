with t1 as(
	select sales.prod, sales.month, avg(r1.quant) prev_avg
	from sales left outer join sales r1
	on r1.prod = sales.prod and r1.month+1 = sales.month
	group by sales.prod, sales.month
)
,t2 as(
	select sales.prod, sales.month, avg(r2.quant) next_avg
	from sales left outer join sales r2
	on r2.prod = sales.prod and r2.month-1 = sales.month
	group by sales.prod, sales.month
)


,t3 as(
select distinct sales.prod, sales.month, prev_avg, next_avg 
from sales natural join t1 natural join t2)
-- select * from t3
-- order by prod, month


-- with t1 as(
-- select distinct s.prod, s.month, (select avg(quant) from sales r1 where r1.prod = s.prod and r1.month+1 = s.month) as prev_avg,
-- (select avg(quant) from sales r2 where r2.prod = s.prod and r2.month-1 = s.month) as next_avg
-- from sales s
-- ),

,t4 as 
(select t3.prod, t3.month, count(s.quant)
from sales s natural join t3
where (s.quant between t3.prev_avg and t3.next_avg)
or (s.quant between t3.next_avg and t3.prev_avg)
group by t3.prod, t3.month
)
select * from t4
order by prod, month


-- select t1.prod as product, t1.month, t2.count as sales_count_between_avgs
-- from t1 left outer join t2
-- -- from t1 left outer join t2
-- on t1.prod = t2.prod and t1.month = t2.month
-- order by t1.prod, month



