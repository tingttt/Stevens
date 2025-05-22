//Export the following functions using ES6 Syntax
import {movies} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import Validation from '../helpers.js';


const createMovie = async (
  title,
  plot,
  genres,
  rating,
  studio,
  director,
  castMembers,
  dateReleased,
  runtime,
  
) => {
  // check if all fields are provided
  if (
    !title ||!plot || !genres ||!rating ||
    !studio ||!director ||! castMembers ||!dateReleased || !runtime
  ) throw 'All fields need to have valid values';
  // check if all fields are strings and not empty spaces
  [title, plot, rating, studio, director, dateReleased, runtime].forEach(element => {
    element = Validation.checkString(element);
  });


  // Title Validation
  //title must be at least two characters and can contain letters a-z, A-Z or numbers.
  if (title.length < 2 || !(/^[a-zA-Z0-9\s]+$/).test(title)) {
    throw new Error("Title must be at least two characters and contain only letters and numbers.");
  }
  // Studio Validation
  if (studio.length < 5 || ! (/^[A-Za-z\s]+$/).test(studio)) {
    throw new Error("Studio must be at least five characters and contain only letters.");
  }

  // Director Validation
  const directorParts = director.trim().split(" "); // split name by space
  if (directorParts.length !== 2) 
    throw new Error("Director must be in the format 'first name space last name'.");
  let firstName = directorParts[0];
  let lastName = directorParts[1];
  if (firstName.length < 3 || lastName.length < 3) {
    throw new Error("Director's first and last names must be at least 3 characters.");
  }
  if (!/^[a-zA-Z]+$/.test(firstName) || !/^[a-zA-Z]+$/.test(lastName)) {
    throw new Error("Director's first and last names must contain only letters.");
  }
  // Rating Validation
  const validRatingList = ["G", "PG", "PG-13", "R", "NC-17"];
  if (!validRatingList.includes(rating)) {
    throw new Error(`Rating must be one of the following: G, PG, PG-13, R, NC-17.`);
  }
   // Genres Validation
   if (!Array.isArray(genres) || genres.length <= 0) {
    throw new Error("Genres must be an array with at least one element.");
  }
  genres.forEach(genre => {
    if (typeof genre !== "string" || genre.trim().length === 0) {
      throw new Error("Genres must contain only non-empty strings.");
    }
    if (genre.length < 5 || !/^[a-zA-Z]+$/.test(genre)) {
      throw new Error("Each genre must be at least five characters and contain only letters.");
    }
  });

  // Cast Members Validation
  if (!Array.isArray(castMembers) || castMembers.length === 0) {
    throw new Error("Cast Members must be an array with at least one element.");
  }
  castMembers.forEach(member => {
    if (typeof member !== "string" || member.trim() === "") {
      throw new Error("Cast Members must contain only non-empty strings.");
    }
  
    const memberParts = member.trim().split(" ");
  
    if (memberParts.length !== 2) {
      throw new Error("Each Cast Member must be in the format 'first name space last name'.");
    }
  
    memberParts.forEach(part => {
      if (part.length < 3 || !/^[a-zA-Z]+$/.test(part)) {
        throw new Error("Cast Member's first and last names must be at least 3 characters and contain only letters.");
      }
    });
  });
  // Date Released Validation
  const dateSplits = dateReleased.split("/");
  if (dateSplits.length !== 3) throw new Error("Date Released must be in mm/dd/yyyy format.");

  const month = parseInt(dateSplits[0], 10);
  const day = parseInt(dateSplits[1], 10);
  const year = parseInt(dateSplits[2], 10);

  if (isNaN(month) || isNaN(day) || isNaN(year)) {
    throw new Error("Date Released must be a valid date.");
  }

  const date = new Date(year, month - 1, day);
// check if date exist
  if (
    date.getMonth() !== month - 1 || // month start at 0
    date.getDate() !== day ||
    date.getFullYear() !== year
  ) {
    throw new Error("Date Released must be a valid date.");
  }

  const currentDate = new Date();
  const yearRangeMin = 1900;
  const yearRangeMax = currentDate.getFullYear() + 2;

  if (year < yearRangeMin || year > yearRangeMax) {
    throw new Error(`Date Released must be between 01/01/1900 and 12/31/2027.`);
  }

  // Runtime Validation
  // const runtimeRegex = /^(?:(\d+)h\s*)?(\d+)min$/;
  const runtimeRegex = /^(\d+)h\s+(\d+)min$/;
  const match = runtime.trim().match(runtimeRegex);
  
  if (!match) {
    throw new Error("Runtime input not match pattern");
  }
  
  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = parseInt(match[2], 10);
  
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || minutes < 0 || minutes > 59 || (hours === 0 && minutes < 31)) {
    throw new Error("Runtime input not valid");
  }


		let newMovie = {
			title: title,
      plot: plot,
      genres: genres,
      rating: rating,
      studio: studio,
      director: director,
      castMembers: castMembers,
      dateReleased: dateReleased,
      runtime: runtime,
      reviews:[],
      overallRating:0
		};
    const moviesCollection = await movies();
		const insertInfo = await moviesCollection.insertOne(newMovie);
		if (!insertInfo.acknowledged || !insertInfo.insertedId)
			throw 'Could not add new movie';

		const movie = await getMovieById(insertInfo.insertedId.toString());
		return movie;
};

const getAllMovies = async () => {
  const movieCollection = await movies();
  let movieList = await movieCollection.find({}).toArray();
  if (!movieList) throw 'Could not get all movies';
  movieList = movieList.map((element) => {
    element._id = element._id.toString();
    return element;
  });
  return movieList;
};

const getMovieById = async (movieId) => {
  if (!movieId) throw 'You must provide an movieId';
  movieId = Validation.checkId(movieId);
  const movieCollection = await movies();
  const movie = await movieCollection.findOne({_id: new ObjectId(movieId)});
  if (!movie) throw 'No movie with that id';
  movie._id = movie._id.toString();
  return movie;
};

const removeMovie = async (movieId) => {
  if (!movieId) throw 'You must provide an id to search for';
  if (typeof movieId !== 'string') throw 'Id must be a string';
  if (movieId.trim().length === 0)
    throw 'id cannot be an empty string or just spaces';
  movieId = movieId.trim();
  if (!ObjectId.isValid(movieId)) throw 'invalid object ID';
  
  const movie = await getMovieById(movieId);
  if (!movie) throw 'Could not find a movie with that ID';
  const movieCollection = await movies();
  const deletionInfo = await movieCollection.findOneAndDelete({
    _id: new ObjectId(movieId)
  });

  if (!deletionInfo) {
    throw `Could not delete movie with id of ${movieId}`;
  }
  return `${movie.title} has been successfully deleted!`;
};

const updateMovie = async (
  movieId,
  title,
  plot,
  genres,
  rating,
  studio,
  director,
  castMembers,
  dateReleased,
  runtime
) => {
  movieId = Validation.checkId(movieId);
  
    // check if all fields are provided
    title = Validation.checkString(title);
    plot = Validation.checkString(plot);
    rating = Validation.checkString(rating);
    studio = Validation.checkString(studio);
    director = Validation.checkString(director);
    dateReleased = Validation.checkString(dateReleased);
    runtime = Validation.checkString(runtime);

    genres = Validation.checkStringArray(genres);
    castMembers = Validation.checkStringArray(castMembers);
    dateReleased = Validation.checkReleasedDate(dateReleased);
    runtime = Validation.checkRunTime(runtime);
  
  
    // Title Validation
    //title must be at least two characters and can contain letters a-z, A-Z or numbers.
    if (title.length < 2 || !(/^[a-zA-Z0-9\s]+$/).test(title)) {
      throw new Error("Title must be at least two characters and contain only letters and numbers.");
    }
    // Studio Validation
    if (studio.length < 5 || ! (/^[A-Za-z\s]+$/).test(studio)) {
      throw new Error("Studio must be at least five characters and contain only letters.");
    }
  
    // Director Validation
    const directorParts = director.trim().split(" "); // split name by space
    if (directorParts.length !== 2) 
      throw new Error("Director must be in the format 'first name space last name'.");
    let firstName = directorParts[0];
    let lastName = directorParts[1];
    if (firstName.length < 3 || lastName.length < 3) {
      throw new Error("Director's first and last names must be at least 3 characters.");
    }
    if (!/^[a-zA-Z]+$/.test(firstName) || !/^[a-zA-Z]+$/.test(lastName)) {
      throw new Error("Director's first and last names must contain only letters.");
    }
    // Rating Validation
    const validRatingList = ["G", "PG", "PG-13", "R", "NC-17"];
    if (!validRatingList.includes(rating)) {
      throw new Error(`Rating must be one of the following: G, PG, PG-13, R, NC-17.`);
    }
     // Genres Validation
     if (!Array.isArray(genres) || genres.length <= 0) {
      throw new Error("Genres must be an array with at least one element.");
    }
    genres.forEach(genre => {
      if (typeof genre !== "string" || genre.trim().length === 0) {
        throw new Error("Genres must contain only non-empty strings.");
      }
      if (genre.length < 5 || !/^[a-zA-Z]+$/.test(genre)) {
        throw new Error("Each genre must be at least five characters and contain only letters.");
      }
    });
  
    // Cast Members Validation
    if (!Array.isArray(castMembers) || castMembers.length === 0) {
      throw new Error("Cast Members must be an array with at least one element.");
    }
    castMembers.forEach(member => {
      if (typeof member !== "string" || member.trim() === "") {
        throw new Error("Cast Members must contain only non-empty strings.");
      }
    
      const memberParts = member.trim().split(" ");
    
      if (memberParts.length !== 2) {
        throw new Error("Each Cast Member must be in the format 'first name space last name'.");
      }
    
      memberParts.forEach(part => {
        if (part.length < 3 || !/^[a-zA-Z]+$/.test(part)) {
          throw new Error("Cast Member's first and last names must be at least 3 characters and contain only letters.");
        }
      });
    });
    // Date Released Validation
    const dateSplits = dateReleased.split("/");
    if (dateSplits.length !== 3) throw new Error("Date Released must be in mm/dd/yyyy format.");
  
    const month = parseInt(dateSplits[0], 10);
    const day = parseInt(dateSplits[1], 10);
    const year = parseInt(dateSplits[2], 10);
  
    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      throw new Error("Date Released must be a valid date.");
    }
  
    const date = new Date(year, month - 1, day);
  // check if date exist
    if (
      date.getMonth() !== month - 1 || // month start at 0
      date.getDate() !== day ||
      date.getFullYear() !== year
    ) {
      throw new Error("Date Released must be a valid date.");
    }
  
    const currentDate = new Date();
    const yearRangeMin = 1900;
    const yearRangeMax = currentDate.getFullYear() + 2;
  
    if (year < yearRangeMin || year > yearRangeMax) {
      throw new Error(`Date Released must be between 01/01/1900 and 12/31/2027.`);
    }
  
    // Runtime Validation
    // const runtimeRegex = /^(?:(\d+)h\s*)?(\d+)min$/;
    const runtimeRegex = /^(\d+)h\s+(\d+)min$/;
    const match = runtime.trim().match(runtimeRegex);
    
    if (!match) {
      throw new Error("Runtime input not match pattern");
    }
    
    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = parseInt(match[2], 10);
    
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || minutes < 0 || minutes > 59 || (hours === 0 && minutes < 31)) {
      throw new Error("Runtime input not valid");
    }
    
    const oldMovie = await getMovieById(movieId);
      let updatedMovie = {
        title: title,
        plot: plot,
        genres: genres,
        rating: rating,
        studio: studio,
        director: director,
        castMembers: castMembers,
        dateReleased: dateReleased,
        runtime: runtime,
        reviews: oldMovie.reviews,
        overallRating: oldMovie.overallRating
      };
    const movieCollection = await movies();
    const updatedInfo = await movieCollection.findOneAndReplace(
      { _id: new ObjectId(movieId) }, updatedMovie);

  if (!updatedInfo) {
    throw 'could not update';
  }
  const resMovie = await getMovieById(movieId);
  return resMovie;
};


const renameMovie = async (id, newName) => {
  //Not used for this lab
};

export {createMovie, getAllMovies, getMovieById, removeMovie, updateMovie};