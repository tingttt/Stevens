with t1 as
(select cust, min(quant) min_q, max(quant) max_q, round(avg(quant)) avg_q 
 from sales
 group by cust
)
,t2 as
(select s.cust, min_q, s.prod min_p, s.date min_dt, s.state st, max_q, avg_q
from t1, sales s
where t1.cust = s.cust
and t1.min_q = s.quant)

,t3 as
(select s.cust, min_q, min_p, min_dt, st, max_q, s.prod max_p, s.date max_dt, s.state max_st, avg_q
from t2, sales s
where t2.cust = s. cust
and t2.max_q = s.quant)

select * from t3
