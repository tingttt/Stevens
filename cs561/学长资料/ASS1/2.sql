with q1 as
(select month mo, day dy, sum(quant) sum_q
from sales
group by mo, dy)

, q2 as 
(select mo, max(sum_q) most_prof_total , min(sum_q) least_prof_total
from q1
group by mo)

, q3 as 
(select q2.mo, dy most_prof_day, most_prof_total 
from q1,q2
where q1.sum_q = q2.most_prof_total)

, q4 as 
(select q2.mo, dy least_prof_day, least_prof_total
from q1,q2
where q1.sum_q = q2.least_prof_total)

,q5 as
(select q3.mo, most_prof_day, most_prof_total, least_prof_day, least_prof_total
from q3 natural join q4)

select * from q5
order by mo