//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
export const movieList = [{
        _id: "507f1f77bcf86cd799439011",     
        title: "Hackers",
        plot: "Hackers are blamed for making a virus that will capsize five oil tankers.",
        genres: ["Crime", "Drama", "Romance"],
        rating: "PG-13",
        studio: "United Artists",
        director: "Iain Softley",
        castMembers: ["Jonny Miller", "Angelina Jolie", "Matthew Lillard", "Fisher Stevens"],
        dateReleased: "09/15/1995",
        runtime: "1h 45min"
    },
    {
        _id: "507f1f77bcf86cd799439012",      
        title: "42",
        plot: "In 1947, Jackie Robinson becomes the first African-American to play in Major League Baseball in the modern era when he was signed by the Brooklyn Dodgers and faces considerable racism in the process.",
        genres: ["Biography", "Drama", "Sport"],
        rating: "PG-13",
        studio: "Warner Brothers",
        director: "Brian Helgeland",
        castMembers: ["Chadwick Boseman", "Harrison Ford", "Nicole Beharie", "Christopher Meloni"],
        dateReleased: "04/09/2013",
        runtime: "2h 8min"
    }, 
    {
        _id: "507f1f77bcf86cd799439013",      
        title: "The Breakfast Club",
        plot: "Five high school students meet in Saturday detention and discover how they have a lot more in common than they thought.",
        genres: ["Comedy", "Drama"],
        rating: "R",
        studio: "Universal Pictures",
        director: "John Hughes",
        castMembers: ["Judd Nelson", "Molly Ringwald", "Ally Sheedy", "Anthony Hall", "Emilio Estevez"],
        dateReleased: "02/07/1985",
        runtime: "1h 37min"
    } 
    ];
    export const disneyMovies = [
        {
          _id: "507f1f77bcf86cd799439017",
          title: "The Lion King",
          plot: "A young lion prince is driven from his kingdom by his uncle, who usurps the throne, and must reclaim what is rightfully his.",
          genres: ["Animation", "Adventure", "Drama", "Family", "Musical"],
          rating: "G",
          studio: "Walt Disney Pictures",
          director: "Roger Allers, Rob Minkoff",
          castMembers: ["Matthew Broderick", "Jeremy Irons", "James Earl Jones", "Nathan Lane"],
          dateReleased: "06/24/1994",
          runtime: "1h 28min",
        },
        {
          _id: "507f1f77bcf86cd799439018",
          title: "Moana",
          plot: "In Ancient Polynesia, when a terrible curse incurred by the demigod Maui reaches Moana's island, she answers the Ocean's call to seek out the demigod to set things right.",
          genres: ["Animation", "Adventure", "Comedy", "Family", "Musical"],
          rating: "PG",
          studio: "Walt Disney Animation Studios",
          director: "John Musker, Ron Clements",
          castMembers: ["Auli'i Cravalho", "Dwayne Johnson", "Rachel House", "Temuera Morrison"],
          dateReleased: "11/23/2016",
          runtime: "1h 47min",
        },
        {
          _id: "507f1f77bcf86cd799439019",
          title: "Toy Story",
          plot: "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
          genres: ["Animation", "Adventure", "Comedy", "Family", "Fantasy"],
          rating: "G",
          studio: "Pixar Animation Studios, Walt Disney Pictures",
          director: "John Lasseter",
          castMembers: ["Tom Hanks", "Tim Allen", "Don Rickles", "Jim Varney"],
          dateReleased: "11/22/1995",
          runtime: "1h 21min",
        },
      ];

      // import { movies } from './config/mongoCollections.js';
      // import { ObjectId } from 'mongodb';
      // const movieCollection = await movies();
      // const movie = await movieCollection.findOne({ _id: new ObjectId("507f1f77bcf86cd799439013") });
      // console.log(!movie);

      // const getMovieById = async (id) => {
      //   if (!id) throw 'You must provide an id to search for';
      //     if (typeof id !== 'string') throw 'Id must be a string';
      //     if (id.trim().length === 0) throw 'id cannot be an empty string or just spaces';
      //     id = id.trim();
      //     if (!ObjectId.isValid(id)) throw 'invalid object ID';
      //     // const movieCollection = await movies();
      //     // const movie = await movieCollection.findOne({ _id: new ObjectId(id) });
      //     const movieCollection = await movies();
      //     const movie = await movieCollection.findOne({ _id: new ObjectId("507f1f77bcf86cd799439013") });
          
      //     if (!movie) throw 'No movie with that id';
      //     movie._id = movie._id.toString()
      //     return movie;
      // };
      // const movie2 = await getMovieById("507f1f77bcf86cd799439013");
      // console.log(movie2);