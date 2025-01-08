import React, { useEffect, useState } from 'react'
import { createComment, fetchComments } from '../../api/todolist.api';
import Label from '../atoms/Label';

function CommentsProject({project}) {  
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [refreshComments, setRefreshComments] = useState(true);
  
    //Comments
    useEffect(() => {
      async function getAllComments() {
        const token = localStorage.getItem('token');
        if (token && project.id) {
          try {
            const response = await fetchComments(project.id, token);
            setComments(response.data);
          } catch (error) {
            console.error(error);
          }
        }
      }
      if (refreshComments) {
        getAllComments();
        setRefreshComments(false);
      }
    }, [project.id, refreshComments]);
  
    const postComment = async () => {
      if (comment && comment != null) {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const response = await createComment(project.id, token, comment);
            setComments((prevComments) => [...prevComments, response.data]);
            setComment("");
            setRefreshComments(true);
          } catch (error) {
            console.error(error);
          }
        }
      } else {
        console.log("empty comment");
      }
  };
  
  return (
    <div className="card-section">
      <Label text="Comments" type="paragraph" />
      
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.slice().reverse().map(comment => (
            <div key={comment.id} className="comment">
              <p><strong>{comment.user}</strong>: {comment.comment}</p>
            </div>
          ))
        ) : (
          <p>No comments yet</p>
        )}
      </div>
      <hr />
      <div className="comment-adding">
        <input
          type="text"
          placeholder="Add comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)} />

        <button className={"blue-button"} onClick={postComment} >Post</button>
      </div>
    </div>
  )
}

export default CommentsProject