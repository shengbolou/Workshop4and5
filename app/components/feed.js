import React from 'react';
import FeedItem from './feedItem';
import StatusUpdateEntry from './statusUpdateEntry';

export default class Feed extends React.Component{
  render(){
    return(
      <div>
        <StatusUpdateEntry />
        <FeedItem />
      </div>
    );
  }
}
