/*Here, you can export the data functions
to get the stocks, people, getStockById, getPersonById.  You will import these functions into your routing files and call the relevant function depending on the route. 
*/
import axios from 'axios'
import exp from 'constants';


const getStocks = async () => {
    const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/8c363d85e61863ac044097c0d199dbcc/raw/7d79752a9342ac97e4953bce23db0388a39642bf/stocks.json')
    return data; 
};

const getPeople = async () => {
    const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/a1196cbf008e85a8e808dc60d4db7261/raw/9fd0d1a4d7846b19e52ab3551339c5b0b37cac71/people.json')
    return data; 
};

const getStockById = async (id) => {
    let data = await getStocks();
	// console.log(data[0].id);
	// console.log(data.find(obj => obj.id === id));
	// return data[0].id == id;
	let res = data.find(obj => obj.id === id);
	if (!res) throw 'Stock Not Found!';
	return res;
};

const getPersonById = async (id) => {
    let data = await getPeople();
	// console.log(data[0].id);
	// console.log(data.find(obj => obj.id === id));
	// return data[0].id == id;
	let res = data.find(obj => obj.id === id);
	if (!res) throw 'Person Not Found!';
	return res; 
};
export { getStocks, getPeople, getStockById, getPersonById };