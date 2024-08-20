async function recursivePopulate(reviews: any) {
  for (const review of reviews) {
    await review.populate({
      path: "childrenReview",
      populate: [
        {
          path: "childrenReview",
          model: "Review",
        },
        {
          path: "userId",
          select: "id name avatar",
        },
      ],
    });

    if (review.childrenReview.length > 0) {
      await recursivePopulate(review.childrenReview);
    }
  }
}

export default recursivePopulate;
