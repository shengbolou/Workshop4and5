import React from 'react';
import FeedItem from './feedItem';
import StatusUpdateEntry from './statusUpdateEntry';
import {getFeedData} from '../server';
import {postStatusUpdate} from '../server';


export default class Feed extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      contents: []
    }
  }

  refresh(){
    getFeedData(this.props.user, (feedData)=>{
      this.setState(feedData);
    })
  }

  onPost(postContents){
    postStatusUpdate(4,"Amherst, MA", postContents, ()=>{
      this.refresh();
    });
  }

  render(){
    return(
      <div>
        <StatusUpdateEntry onPost={(postContents)=>this.onPost(postContents)}/>
        {this.state.contents.map((feeditem)=>{
            return (
                <FeedItem key={feeditem._id} data={feeditem} />
            );
        })}
      </div>
    );
  }

  componentDidMount() {
      this.refresh();
  }

}
