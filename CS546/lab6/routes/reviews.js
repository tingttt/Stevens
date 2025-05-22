//require express and express router as shown in lecture code
import {Router} from 'express';
const router = Router();
import * as reviewData from '../data/reviews.js';
import * as movieData from '../data/movies.js';
import Validation from '../helpers.js';
router
  .route('/:movieId')
  .get(async (req, res) => {
    //code here for GET
    try {
			if (!req.params.movieId) throw 'You must Specify :movieId';
			req.params.movieId = Validation.checkId(req.params.movieId);
		} catch (e) {
			return res.status(400).json({ error: e });
		}
		try {
			const allReviews = await reviewData.getAllReviews(req.params.movieId);
			if (allReviews.length === 0)
				throw "No Reviews in the Movie";
			res.status(200).json(allReviews);
		} catch (e) {
			res.status(404).json({ error: e });
		}
  })
  .post(async (req, res) => {
    //code here for POST
    let moviePostData = req.body;
		try {
			req.params.movieId = Validation.checkId(req.params.movieId);
			if (
				!moviePostData.reviewTitle ||
				!moviePostData.reviewerName ||
				!moviePostData.review ||
				!moviePostData.rating
			)throw 'All fields need to have valid values here';
      moviePostData.reviewTitle = Validation.checkString(moviePostData.reviewTitle);
      moviePostData.reviewerName = Validation.checkString(moviePostData.reviewerName);
      moviePostData.review = Validation.checkString(moviePostData.review);
      moviePostData.rating = Validation.checkRating(moviePostData.rating);
		} catch (e) {
			return res.status(400).json({ error: e });
		}
		try {
			const targetMovie = await movieData.getMovieById(req.params.movieId);
      
			const createdReview = await reviewData.createReview(
				req.params.movieId,
				moviePostData.reviewTitle,
				moviePostData.reviewerName,
				moviePostData.review,
				moviePostData.rating
			);

			const movie = await movieData.getMovieById(
				createdReview._id.toString()
			);
			res.status(200).json(movie);
		} catch (e) {
			return res.status(404).json({ error: e });
		}
  });

router
  .route('/review/:reviewId')
  .get(async (req, res) => {
    //code here for GET
    try {
      if (!req.params.reviewId) throw 'You must Specify :reviewId';
      req.params.reviewId = Validation.checkId(req.params.reviewId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const review = await reviewData.getReview(req.params.reviewId);
      res.status(200).json(review);
    } catch (e) {
      res.status(404).json({ error: e });
    }
  })
  .delete(async (req, res) => {
    //code here for DELETE
    try {
			if (!req.params.reviewId) throw 'You must Specify :reviewId';
			req.params.reviewId = Validation.checkId(req.params.reviewId);
		} catch (e) {
			return res.status(400).json({ error: e });
		}
		try {
			const removeReview = await reviewData.removeReview(req.params.reviewId);

      res.status(200).json(removeReview);
		} catch (e) {
			res.status(404).json({ error: e });
		}
  });
  export default router;