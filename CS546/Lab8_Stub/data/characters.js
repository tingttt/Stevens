//import axios, md5
import axios from 'axios';
import md5 from 'blueimp-md5'
import Validation from '../helpers.js';
export const searchCharactersByName = async(name) => {
    //Function to search the api and return up to 20 characters matching the name param
    const publickey = Validation.Marvelpublickey;
    const privatekey = Validation.Marvelprivatekey;
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
    const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

    if (!name) throw "Input must be provided"
    name = Validation.exportedMethods.checkString(name, "Character name")
    console.log( url + '\&nameStartsWith=' + name)
    try {
        var { data } = await axios.get(
            url + '\&nameStartsWith=' + name
        );
    } catch (e) {
        return null;
    }
    if (!data) throw "No Show with that name"
    var res = data.data.results;

    var sliceres = res.slice(0, 20)
    return sliceres;
};

export const getCharacterById = async(id) => {
    //Function to fetch a character from the api matching the id
    const publickey = Validation.Marvelpublickey;
    const privatekey = Validation.Marvelprivatekey;
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
    const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
    id = Validation.exportedMethods.checkNumber(id, "id");



    try {
        var { data } = await axios.get(
            url + '\&id=' + id
        );
    } catch (e) {
        return null;
    }
    if (data.code === 200) return data.data.results[0];
};

export default {
    searchCharactersByName,
    getCharacterById,
};