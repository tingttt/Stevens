with q1 as 
(select cust, prod, max(quant) nj_max
 from sales
 where state = 'NJ'
 group by cust, prod
)

, q2 as
(select cust, prod, max(quant) ny_max
 from sales
 where state = 'NY'
 group by cust, prod
)


, q3 as 
(select cust, prod, max(quant) ct_max
 from sales
 where state = 'CT'
 group by cust, prod
)

,q4 as
(select q1.cust, q1.prod prod, nj_max, sales.date nj_date
from sales,q1
where sales.quant = nj_max 
 and sales.prod = q1.prod and sales.state = 'NJ' and sales.cust = q1.cust
)

,q5 as
(select q2.cust, q2.prod prod, ny_max, sales.date ny_date
from sales,q2
where sales.quant = ny_max 
 and sales.prod = q2.prod and sales.state = 'NY' and sales.cust = q2.cust
)

,q6 as
(select q3.cust, q3.prod prod, ct_max, sales.date ct_date
from sales,q3
where sales.quant = ct_max 
 and sales.prod = q3.prod and sales.state = 'CT' and sales.cust = q3.cust
)

,q7 as
(select cust, prod, nj_max, nj_date, ny_max ,ny_date, ct_max, ct_date
from q4 natural join  q5 natural join q6
)

,q8 as 
(select cust, prod, nj_max, nj_date, ny_max ,ny_date, ct_max, ct_date
from q7
where ny_max > nj_max and ny_max > ct_max)

select * from q8
order by prod,cust