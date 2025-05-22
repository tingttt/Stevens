//require express and express router as shown in lecture code
import {Router} from 'express';
const router = Router();
import * as movieData from '../data/movies.js';
import Validation from '../helpers.js';

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
		try {
			const allMovies = await movieData.getAllMovies();
			res.status(200).json(allMovies);
		} catch (e) {
			res.status(404).json({ error: e });
		}
  })
  .post(async (req, res) => {
    //code here for POST
    let moviePostData = req.body;
		try {
			if (
				!moviePostData.title ||
				!moviePostData.plot ||
				!moviePostData.genres ||
				!moviePostData.rating ||
				!moviePostData.studio ||
				!moviePostData.director ||
        !moviePostData.castMembers ||
        !moviePostData.dateReleased ||
        !moviePostData.runtime
			)
				throw 'All fields need to have valid values';
        moviePostData.title = Validation.checkString(moviePostData.title);
        moviePostData.plot = Validation.checkString(moviePostData.plot);
        moviePostData.rating = Validation.checkString(moviePostData.rating);
        moviePostData.studio = Validation.checkString(moviePostData.studio);
        moviePostData.director = Validation.checkString(moviePostData.director);
        moviePostData.dateReleased = Validation.checkString(moviePostData.dateReleased);
        moviePostData.runtime = Validation.checkString(moviePostData.runtime);

        moviePostData.genres = Validation.checkStringArray(moviePostData.genres);
        moviePostData.castMembers = Validation.checkStringArray(moviePostData.castMembers);
        moviePostData.dateReleased = Validation.checkReleasedDate(moviePostData.dateReleased);
        moviePostData.runtime = Validation.checkRunTime(moviePostData.runtime);

		} catch (e) {
			return res.status(400).json({ error: e });
		}
		try {
			const newMovie = await movieData.createMovie(
				moviePostData.title,
				moviePostData.plot,
				moviePostData.genres,
				moviePostData.rating,
				moviePostData.studio,
				moviePostData.director,
        moviePostData.castMembers,
        moviePostData.dateReleased,
        moviePostData.runtime
			);
			res.status(200).json(newMovie);
		} catch (e) {
			return res.status(400).json({ error: e });
		}
  });

router
  .route('/:movieId')
  .get(async (req, res) => {
    //code here for GET
    try {
			req.params.movieId = Validation.checkId(req.params.movieId);
		} catch (e) {
			return res.status(400).json({ error: e });
		}
		try {
			const movie = await movieData.getMovieById(req.params.movieId);
			res.status(200).json(movie);
		} catch (e) {
			res.status(404).json({ error: e });
		}
  })
  .delete(async (req, res) => {
    //code here for DELETE
    try {
			req.params.movieId = Validation.checkId(req.params.movieId);
		} catch (e) {
			return res.status(400).json({ error: e });
		}
		try {
			await movieData.getMovieById(req.params.movieId);
		} catch (e) {
			return res.status(404).json({ error: e });
		}
		try {
			const removedmovie = await movieData.removeMovie(req.params.movieId);
			res.status(200).json({ movieId: req.params.movieId, deleted: true });
		} catch (e) {
			res.status(404).json({ error: e });
		}
  })
  .put(async (req, res) => {
    //code here for PUT
    let moviePostData = req.body;
		try {
			if (
				!moviePostData.title ||
				!moviePostData.plot ||
				!moviePostData.genres ||
				!moviePostData.rating ||
				!moviePostData.studio ||
				!moviePostData.director ||
        !moviePostData.castMembers ||
        !moviePostData.dateReleased ||
        !moviePostData.runtime
			)
				throw 'All fields need to have valid values';
        moviePostData.title = Validation.checkString(moviePostData.title);
        moviePostData.plot = Validation.checkString(moviePostData.plot);
        moviePostData.rating = Validation.checkString(moviePostData.rating);
        moviePostData.studio = Validation.checkString(moviePostData.studio);
        moviePostData.director = Validation.checkString(moviePostData.director);
        moviePostData.dateReleased = Validation.checkString(moviePostData.dateReleased);
        moviePostData.runtime = Validation.checkString(moviePostData.runtime);

        moviePostData.genres = Validation.checkStringArray(moviePostData.genres);
        moviePostData.castMembers = Validation.checkStringArray(moviePostData.castMembers);
        moviePostData.dateReleased = Validation.checkReleasedDate(moviePostData.dateReleased);
        moviePostData.runtime = Validation.checkRunTime(moviePostData.runtime);

		} catch (e) {
			return res.status(400).json({ error: e });
		}
		try {
			await movieData.getMovieById(req.params.movieId);
		} catch (e) {
			return res.status(404).json({ error: e });
		}
		try {
			const updatedMovie = await movieData.updateMovie(
        req.params.movieId,
        moviePostData.title,
				moviePostData.plot,
				moviePostData.genres,
				moviePostData.rating,
				moviePostData.studio,
				moviePostData.director,
        moviePostData.castMembers,
        moviePostData.dateReleased,
        moviePostData.runtime
        
			);
			res.status(200).json(updatedMovie);
		} catch (e) {
			res.status(404).json({ error: e });
		}
  });
  export default router;