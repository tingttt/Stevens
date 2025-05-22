//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/characters.js that you will call in your routes below
import { Router } from 'express';
const router = Router();

import Validation from '../helpers.js';

import * as characterdata from '../data/characters.js';
import { title } from 'process';

router.route('/').get(async(req, res) => {
    //code here for GET will render the home handlebars file
    try {
        res.render('home', {
            title: 'Marvel Universe Character Search'
        });
    } catch (e) {
        console.error(e);
        res.status(500).render('error', {
            title: "500",
            message: 'Failed to load home page'
        });
    }
});

router.route('/searchmarveluniverse').post(async(req, res) => {
    //code here for POST this is where your form will be submitting searchCharacterByName and then call your data function passing in the searchCharacterByName and then rendering the search results of up to 15 characters.
    try {
        var searchCharacterByName = req.body.searchByCharactersName;
        if (typeof searchCharacterByName !== 'string' || searchCharacterByName.trim() === "") {
            return res.status(400).render('error', {
                title: "400 Invalid Input",
                message: "Search term must be provided and cannot be empty or contain only spaces."
            });
        }
        searchCharacterByName = Validation.exportedMethods.checkString(searchCharacterByName, 'Character Name');
        const searchResults = await characterdata.searchCharactersByName(searchCharacterByName);

        res.render('characterSearchResults', {
            title: 'Characters Found',
            searchByCharactersName: searchCharacterByName,
            searchResults: searchResults
        });
    } catch (e) {
        console.error(e);
        res.status(400).render('error', {
            title: "400 characterSearchResults bad request",
            message: e
        });
    }
});

router.route('/character/:id').get(async(req, res) => {
    //code here for GET a single character
    try {
        var id = req.params.id;
        id = Validation.exportedMethods.checkNumber(id, 'Character iD');
        const character = await characterdata.getCharacterById(id);
        if (!character) {
            return res.status(404).render('error', {
                title: "404 Not Found",
                message: 'Character not found'
            });
        }
        res.render('characterById', {
            title: character.name,
            character: character
        });
    } catch (e) {
        console.error(e);
        res.status(400).render('error', {
            title: "400 character bad request",
            message: e
        });
    }
});

//export router
export default router;