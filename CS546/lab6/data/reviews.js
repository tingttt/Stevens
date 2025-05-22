//Export the following functions using ES6 Syntax

import {movies} from '../config/mongoCollections.js';
import * as movieData from './movies.js';
import {ObjectId} from 'mongodb';
import Validation from '../helpers.js';

const createReview = async (
  movieId,
  reviewTitle,
  reviewerName,
  review,
  rating
) => {
  if (!movieId || !reviewTitle || !reviewerName || !review || !rating) 
    throw 'All fields need to have valid values to create review';
  movieId = Validation.checkId(movieId);
  const movieCollection = await movies();
  const findMovie = await movieData.getMovieById(movieId);
  if (!findMovie) throw 'No movie with that id';
  reviewTitle = Validation.checkString(reviewTitle);
  reviewerName = Validation.checkString(reviewerName);
  review = Validation.checkString(review);
  rating = Validation.checkRating(rating);

  let neWREviewID = new ObjectId();

  let reviewDate = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
  const updateInfo = await movieCollection.updateOne(
    { _id: new ObjectId(movieId) },
    {
      $addToSet: {
        reviews: {
          _id: neWREviewID,
          reviewTitle: reviewTitle,
          reviewDate: reviewDate,
          reviewerName: reviewerName,
          review: review,
          rating: rating,
        },
      },
    }
  );

if (updateInfo.modifiedCount === 0) {
    throw 'could not update';
  }
  const resMovie = await movieData.getMovieById(movieId);
  return resMovie;
};

const getAllReviews = async (movieId) => {
  if (!movieId) throw 'Need to provide movie ID';
  movieId = Validation.checkId(movieId);
  
  const movieCollection = await movies();
  const findMovie = await movieCollection.findOne({ _id: new ObjectId(movieId) });
  
  if (findMovie === null) throw 'No movie with that id';
  
  const allReviews = findMovie.reviews || [];

  for (let i in allReviews) {
    allReviews[i]._id = allReviews[i]._id.toString();
  }
  
  return allReviews;
};

const getReview = async (reviewId) => {
  if (!reviewId) throw 'Need to provide input review ID';
  reviewId = Validation.checkId(reviewId);
  
  const movieCollection = await movies();
  
  let moviehasReview = await movieCollection.findOne(
    {
      'reviews._id': new ObjectId(reviewId)
    },
    { projection: { _id: 0, reviews: 1 } }
  );
  
  if (!moviehasReview) throw 'Review not found';
  
  const allreviews = moviehasReview.reviews;
  
  for (let i in allreviews) {
    let reviewstofind = allreviews[i]._id.toString();
    
    if (reviewstofind === reviewId) {
      return allreviews[i];
    }
  }
  throw 'Review not found in given Movie';
};

const removeReview = async (reviewId) => {
  if (!reviewId) throw 'Need to provide review ID';
  reviewId = Validation.checkId(reviewId);
		const review = await getReview(reviewId);
		if (!review) throw 'No review with that id';

		const movieCollection = await movies();

		const movie = await movieCollection.findOne({
			'reviews._id': new ObjectId(reviewId),
		});
    if (!movie) throw 'cannot find movie with this review';

		let movieId = movie._id.toString(); //change to string to make it work for obejct ID

		const updateInfo = await movieCollection.updateOne(
			{ _id: new ObjectId(movieId) },
			{ $pull: { reviews: { _id: new ObjectId(reviewId) } } }
		);
    if (updateInfo.modifiedCount === 0) {
      throw 'could not update movie successfully';
    }

    const allReviews = await getAllReviews(movieId);


    let updatedRating = 0;
    if (allReviews.length > 0) {
      let totalRating = 0;
      for (let i in allReviews) {
        totalRating += allReviews[i].rating;
      }
      updatedRating = totalRating / allReviews.length;
      updatedRating = Math.round(updatedRating * 10) / 10; //round to one dec
    }
    

    const updatedInfo = await movieCollection.updateOne(
      { _id: new ObjectId(movieId) },
      { $set: { overallRating: updatedRating } }
    );
    
    if (updatedInfo.matchedCount === 0) {
      throw 'could not update movie rating';
    }
		let updatedMovie = await movieData.getMovieById(movieId);
		return updatedMovie;
};

export{createReview, getAllReviews, getReview, removeReview}; 
