import React from 'react';
import ReactDOM from 'react-dom';
import CommentBox from './CommentBox';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <CommentBox
  url='https://chris-commentproject.herokuapp.com/api/comments'
  pollInterval={2000} />,
  document.getElementById('root')
 );
registerServiceWorker();
