//export the following functions using ES6 syntax
import { movies } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
function stringCheck(inputString) {
	if (typeof inputString !== 'string') throw 'input must be a string';
	if (inputString.trim().length === 0)
		throw 'Input cannot be an empty string or string with just spaces';
	inputString = inputString.trim();
	return inputString;
}
const createMovie = async (
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
  // check if all fields are provided
  if (
    !title ||!plot || !genres ||!rating ||
    !studio ||!director ||! castMembers ||!dateReleased || !runtime
  ) throw 'All fields need to have valid values';
  // check if all fields are strings and not empty spaces
  [title, plot, rating, studio, director, dateReleased, runtime].forEach(element => {
    element = stringCheck(element);
  });


  // Title validation
  //title must be at least two characters and can contain letters a-z, A-Z or numbers.
  if (title.length < 2 || !(/^[a-zA-Z0-9\s]+$/).test(title)) {
    throw new Error("Title must be at least two characters and contain only letters and numbers.");
  }
  // Studio validation
  if (studio.length < 5 || ! (/^[A-Za-z\s]+$/).test(studio)) {
    throw new Error("Studio must be at least five characters and contain only letters.");
  }

  // Director validation
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
  // Rating validation
  const validRatingList = ["G", "PG", "PG-13", "R", "NC-17"];
  if (!validRatingList.includes(rating)) {
    throw new Error(`Rating must be one of the following: G, PG, PG-13, R, NC-17.`);
  }
   // Genres validation
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

  // Cast Members validation
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
  // Date Released validation
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

  // Runtime validation
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
      runtime: runtime
		};
    const moviesCollection = await movies();
		const insertInfo = await moviesCollection.insertOne(newMovie);
		if (!insertInfo.acknowledged || !insertInfo.insertedId)
			throw 'Could not add new movie';

		const movie = await getMovieById(insertInfo.insertedId.toString());
		return movie;
};

const getAllMovies = async () => {
  const moviesCollection = await movies();
		let movieList = await moviesCollection.find({}).toArray();
		if (!movieList) throw 'Could not get all Movies';
		movieList.map((element) => {
			element._id = element._id.toString();
      return element;
		});
		return movieList;
};

const getMovieById = async (id) => {
  if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0) throw 'id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    const movieCollection = await movies();
    const movie = await movieCollection.findOne({ _id: new ObjectId(id) });  
    if (!movie) throw 'No movie with that id';
    movie._id = movie._id.toString()
    return movie;
};

const removeMovie = async (id) => {
  if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    
    const movie = await getMovieById(id);
    if (!movie) throw 'Could not find a movie with that ID';
    const movieCollection = await movies();
    const deletionInfo = await movieCollection.findOneAndDelete({
      _id: new ObjectId(id)
    });

    if (!deletionInfo) {
      throw `Could not delete movie with id of ${id}`;
    }
    return `${movie.title} has been successfully deleted!`;
};

const renameMovie = async (id, newName) => {
  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string') throw 'Id must be a string';
  if (id.trim().length === 0)
    throw 'id cannot be an empty string or just spaces';
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';
  if (!newName) throw 'You must provide a Name';
  if (typeof newName !== 'string') throw 'Name must be a string';
  if (newName.trim().length === 0)
    throw 'Name cannot be an empty string or just spaces';

  newName = newName.trim();
  id = id.trim();

  const movie = await getMovieById(id);
  if (!movie) throw 'Could not find a movie with that ID';

  if (movie.title === newName)
    throw 'New Name is the same as Existing Movie Name';
  let updatedMovie = {
    title: newName,
    plot: movie.plot,
    genres: movie.genres,
    rating: movie.rating,
    studio: movie.studio,
    director: movie.director,
    castMembers: movie.castMembers,
    dateReleased: movie.dateReleased,
    runtime: movie.runtime
  };
  const movieCollection = await movies();
  const updatedInfo = await movieCollection.findOneAndReplace(
    {_id: new ObjectId(id)},
    updatedMovie
  );

  if (!updatedInfo) {
    throw 'could not update movie successfully';
  }
  const resMovie = await getMovieById(id);
  return resMovie;
};

export { createMovie, getAllMovies, getMovieById, removeMovie, renameMovie };
