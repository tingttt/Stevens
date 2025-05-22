with t1 as(
select prod, month, max(quant) maxq, min(quant) minq
from sales
group by prod, month
	),
t2 as (
select prod, max(maxq) maxn, min(minq) minn
from t1
group by prod)

select t2.prod, t1.month, t2.maxn, t1.month, t2.minn
from t1, t2
where t2.maxn = t1.maxq and t2.minn = t1.minq
order by t2.prod
