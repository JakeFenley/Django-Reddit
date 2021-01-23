const modifyComment = (action, comment, objects) => {
  switch (action) {
    case "createUpdateCommentVote": {
      const { vote } = objects;

      comment.score = vote.updated_value;
      comment.votes[0] = {
        value: vote.value,
        submission_type: "comment",
      };

      return comment;
    }

    case "addComment": {
      const { newComment } = objects;
      comment.comments_field = [newComment, ...comment.comments_field];
      return comment;
    }
  }
};

export default function updateCommentTree(comments, id, objects, action) {
  let commentFound = false;
  return comments.map((x) => {
    if (commentFound) {
      return x;
    } else if (x.id === id) {
      x = modifyComment(action, x, objects);
      commentFound = true;
      return x;
    } else if (x.comments_field.length > 0) {
      x.comments_field = updateCommentTree(
        x.comments_field,
        id,
        objects,
        action
      );
      return x;
    } else {
      return x;
    }
  });
}
