var React = require('react');
var Message = require('./message');

var ViewAllMessages = React.createClass({
  render: function() {
    var messagesObject = this.props.messages; // from Firebase

    // Push messages from Firebase to messageRows
    var messageRows = [];
    for(messageKey in messagesObject){
      var commentRows = [];
      var message = messagesObject[messageKey];
      messageRows.push(
        <Message
          uid={ message.uid }
          sessions={ this.props.sessions }
          messageId={ message.messageId }
          key={ message.messageId }
          token={ this.props.token }
          auth={ this.props.auth }
          baseId={ message.baseId}
          hairId={ message.hairId}
          message={ message.message }
          comments={ message.comments }
          votes={ message.votes }
          messageId={ message.messageId }
          timestamp={ message.timestamp }
          city = { message.city }/>
      )
    }

    // Sort Messages by time or popularity (ie number of votes)
    var messageRowsSortedOptions = {
      recent: messageRows.sort(function(a,b){
        return b.props.timestamp - a.props.timestamp;
      }).filter(function(message){
        if(localStorage.getItem('city')){
          if(localStorage.getItem('city')===message._store.props.city){
            return true;
          }
        }
        if(!localStorage.getItem('city')){
          if(!message._store.props.city){
            return true;
          }
        }
        return false;
      }),

      popular: messageRows.slice().sort(function(a,b){
        return b.props.votes - a.props.votes;
      }).filter(function(message){
        if(localStorage.getItem('city')){
          if(localStorage.getItem('city')===message._store.props.city){
            return true;
          }
        }
        if(!localStorage.getItem('city')){
          if(!message._store.props.city){
            return true;
          }
        }
        return false;
      }),
      
      favorites: messageRows.filter(function(message){
        if(this.props.sessions[this.props.auth.uid] && this.props.sessions[this.props.auth.uid].favorites){
          return this.props.sessions[this.props.auth.uid].favorites.hasOwnProperty(message.props.messageId);
        }
        return false;
      }.bind(this)).sort(function(a,b){ // not sorting correctly - FIX
        return b.props.timestamp - a.props.timestamp;
      }),
      
      myPosts: messageRows.filter(function(message){
        if(this.props.sessions[this.props.auth.uid] && this.props.sessions[this.props.auth.uid].posted){
          return this.props.sessions[this.props.auth.uid].posted.hasOwnProperty(message.props.messageId);
        }
        return false;
      }.bind(this)),
      
      city: messageRows.filter(function(message){
          console.log(message._store.props.city, 'isnide VIEW ALL MESSAGES')
        if(localStorage.getItem('city')===message._store.props.city){
          return true;
        }
        return false;
      }),
    }
    return (
      <div style={ this.styles.messageRows }>
        { messageRowsSortedOptions[this.props.sortBy] }

      </div>
    )
  },

  styles: {
    messageRows: {
      padding: '10px',
    },
  }
});

module.exports = ViewAllMessages;
