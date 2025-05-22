/*

1. Create a Movie of your choice.
2. Log the newly created Movie. (Just that movie, not all movies)
3. Create another movie of your choice.
4. Query all movies, and log them all
5. Create the 3rd movie of your choice.
6. Log the newly created 3rd movie. (Just that movie, not all movies)
7. Rename the first movie
8. Log the first movie with the updated name. 
9. Remove the second movie you created.
10. Query all movies, and log them all
11. Try to create a movie with bad input parameters to make sure it throws errors.
12. Try to remove a movie that does not exist to make sure it throws errors.
13. Try to rename a movie that does not exist to make sure it throws errors.
14. Try to rename a movie passing in invalid data for the newName parameter to make sure it throws errors.
15. Try getting a movie by ID that does not exist to make sure it throws errors.

*/

import * as movieData from './data/movies.js';
import {dbConnection, closeConnection} from './config/mongoConnection.js';

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();
    let movie1;
    try{
    movie1 = await movieData.createMovie(
        "The Matrix",
        "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
        ["Action", "SciFi"],
        "R",
        "Warner Bros Pictures",
        "The Wachowskis",
        ["Keanu Reeves", "Laurence Fishburne", "Carrie Moss"],
        "03/31/1999",
        "2h 16min"
      );
      console.log(movie1);
    } catch(e) {
            console.log("Got an error!");
            console.log(e);
    }
    let movie2;
    try { 
        movie2 = await movieData.createMovie(
            "The Lion King",
            "A young lion prince is driven from his kingdom by his uncle, who usurps the throne, and must reclaim what is rightfully his.",
            ["Animation", "Adventure", "Drama", "Family", "Musical"],
            "G",
            "Walt Disney Pictures",
            "Roger Allers",
            ["Matthew Broderick", "Jeremy Irons", "James Jones", "Nathan Lane"],
            "06/24/1994",
            "1h 28min"
          );
    } catch(e) {
        console.log("Got an error!");
        console.log(e);
    }

    try { 
    const allMovies = await movieData.getAllMovies();
    console.log(allMovies);
    } catch(e) {
        console.log("Got an error!");
        console.log(e);
    }
    let movie3;
    try{
        movie3 = await movieData.createMovie(
            "Toy Story",
            "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
            ["Animation", "Adventure", "Comedy", "Family", "Fantasy"],
            "G",
            "Pixar Animation Studios Walt Disney Pictures",
            "John Lasseter",
            ["Tom Hanks", "Tim Allen", "Don Rickles", "Jim Varney"],
            "11/22/1995",
            "1h 21min"
          );
          console.log(movie3);
    } catch(e) {
            console.log("Got an error!");
            console.log(e);
    }
    console.log(movie1);
    try { 
        const renamedMovie1 = await movieData.renameMovie(movie1._id, "Rename The Matrix");
        console.log(renamedMovie1);
    } catch(e) {
        console.log("Got an error!");
        console.log(e);
    }

    try{
        const removeMovie2= await movieData.removeMovie(movie2._id);
        console.log(removeMovie2);
    } catch(e) {
        console.log("Got an error!");
        console.log(e);
    }
    try { 
        const allMovies = await movieData.getAllMovies();
        console.log(allMovies);
    } catch(e) {
        console.log("Got an error!");
        console.log(e);
    }
    try{
        const movie4 = await movieData.createMovie(
            "Toy Story",
            "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
            ["Animation", "Adventure", "Comedy", "Family", "Fantasy"],
            "G",
            "Pixar Animation Studios Walt Disney Pictures",
            "John Lasseter",
            ["Tom Hanks", "Tim Allen", "Don Rickles", "Jim Varney"],
            "11/22/1995",
            "1h 66min"
          );
          console.log(movie4);
    } catch(e) {
            console.log("Got an error!");
            console.log(e);
    }

    try {
        const removeFortyTwo = await movieData.removeMovie("507f1f77bcf86cd799439012"); 
        console.log(removeFortyTwo);
    } catch (e) {
        console.error(e);
    }
    try { 
        const renamedFortyTwo = await movieData.renameMovie("507f1f77bcf86cd799439012", "Forty Two"); 
        console.log(renamedFortyTwo); 
    } catch(e) {
        console.log("Got an error!");
        console.log(e);
    }
    try {
        await movieData.renameMovie(movie3._id, ""); // Invalid newName
      } catch (error) {
        console.error("Rename movie with invalid name error:", error.message);
      }
    try { 
        const theBreakfastClub = await movieData.getMovieById("507f1f77bcf86cd799439013"); 
     console.log(theBreakfastClub);
    } catch(e) {
        console.log("Got an error!");
        console.log(e);
    }

    await closeConnection();
    console.log('Done!');
}

main();