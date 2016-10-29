import React from 'react';
import StatusUpdate from './statusUpdate';
import CommentThread from './commentThread';
import Comment from './comment';
import {postComment} from '../server'
import {likeFeedItem} from '../server'
import {unlikeFeedItem} from '../server'

export default class FeedItem extends React.Component{

  constructor(props){
    super(props);
    this.state = props.data;
  }

  handleCommentPost(comment){
    postComment(this.state._id,4,comment,(updateFeedComment)=>{
      this.setState(updateFeedComment);
    })
  }

  handleLikeClick(clickEvent) {
    // Stop the event from propagating up the DOM
    // tree, since we handle it here. Also prevents
    // the link click from causing the page to scroll to the top.
    clickEvent.preventDefault();
    // 0 represents the 'main mouse button' --
    // typically a left click
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
    if (clickEvent.button === 0) {
      // Callback function for both the like and unlike cases.
      var callbackFunction = (updatedLikeCounter) => {
        // setState will overwrite the 'likeCounter'
        // field on the current state, and will keep
        // the other fields in-tact. This is called a
        // shallow merge:
        // https://facebook.github.io/react/docs/component-api.html#setstate
        this.setState({likeCounter: updatedLikeCounter});
      };
      if (this.didUserLike()) {
        // User clicked 'unlike' button.
        unlikeFeedItem(this.state._id, 4, callbackFunction);
      } else {
        // User clicked 'like' button.
        likeFeedItem(this.state._id, 4, callbackFunction);
      }
    }
  }

  /**
  * Returns 'true' if the user liked the item.
  * Returns 'false' if the user has not liked the item.
  */
  didUserLike() {
    var likeCounter = this.state.likeCounter;
    var liked = false;
    // Look for a likeCounter entry with userId 4 -- which is the
    // current user.
    for (var i = 0; i < likeCounter.length; i++) {
      if (likeCounter[i]._id === 4) {
        liked = true;
        break;
      }
    }
    return liked;
  }

  render() {
    var data = this.state;
    var contents;
    switch(data.type) {
      case "statusUpdate":
      // Create a StatusUpdate. Dynamically created
      // React component: needs a key.
      // Keys only need to be unique among *siblings*,
      // so we can re-use the same key as the FeedItem.
      contents = (
        <StatusUpdate key={data._id}
          author={data.contents.author}
          postDate={data.contents.postDate}
          location={data.contents.location}>
          {data.contents.contents.split("\n").map((line,i)=>{
            return (
              <p key={"line" + i}>{line}</p>
            );
          })}
        </StatusUpdate>
      );
      break;
      default:
      throw new Error("Unknown FeedItem: " + data.type);
    }
    return (
      <div className="fb-status-update panel panel-default">
        <div className="panel-body">
          {contents}
          <hr />
          <div className="row">
            <div className="col-md-12">
              <ul className="list-inline">
                <li>
                  <a href="#" onClick={(e)=>this.handleLikeClick(e)}>
                    <span className="glyphicon glyphicon-thumbs-up">
                    </span> Like
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span className="glyphicon glyphicon-comment">
                    </span>
                    Comment
                  </a>
                </li>
                  <li>
                    <a href="#">
                      <span className="glyphicon glyphicon-share-alt">
                      </span> Share
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
            <div className="panel-footer">
              <div className="row">
                <div className="col-md-12">
                  <a href="#">{data.likeCounter.length} people</a>
                  like this
                </div>
              </div>
              <hr />
              <CommentThread onPost={(comment)=>this.handleCommentPost(comment)}>
                {
                  data.comments.map((comment, i) => {
                    // i is comment's index in comments array
                    return (
                      <Comment key={i}
                        author={comment.author}
                        postDate={comment.postDate}>
                        {comment.contents}
                      </Comment>
                    );
                  })
                }
              </CommentThread>
            </div>
          </div>
        )
      }
    }
