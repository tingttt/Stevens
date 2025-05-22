with t1 as (
select  prod, sum(quant) sum_q, month
from sales s
group by prod,month
)

,t2 as (
select  t1.prod, max(sum_q) max_q, min(sum_q) min_q
from  t1
group by t1.prod
)

,t3 as (
select  t1.prod prod, t2.max_q, t1.month most_favorable_mo
from t1, t2
where t1.sum_q = max_q 
)

,t4 as (
select  t1.prod prod, t2.min_q, t1.month least_favorable_mo
from t1, t2
where t1.sum_q = min_q 

)

,t5 as (
select  t3.prod, t3.most_favorable_mo, t4.least_favorable_mo
from t3 inner join t4
	on t3.prod = t4.prod
)

select * from t5