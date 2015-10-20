var React = require('react');
// var url = 'http://104.236.172.91:80/comment';
var url = 'http://104.131.139.49:80/comment';

var commentBox = React.createClass({
  getInitialState: function() {
    return {
      comment: ''
    };
  },
  // Update message value whenever user changes the message in the comment box
  handleChange: function(event){
    if(event.target.value.length <= 150) { // Message cannot be longer than 150 characters
      console.log(this.props.token);
      this.setState({
        'comment': event.target.value,
      });
    }
  },
  // Post a message when "Submit" button is clicked
  handleClick: function(event){
    event.preventDefault();
    $.ajax({
      type: 'POST',
      url: url,
      contentType: 'application/json',
      data: JSON.stringify({
        "comment": this.state.comment,
        'messageId': this.props.messageId,
        "token": this.props.token,
      }),
      success: function(d){
        console.log('POST successful: ', d);
      }
    });
    this.setState({comment: ''}); // Clear comment box
    console.log(this.props.auth);
  },

   enterPressed: function(event) {
    if(event.keyCode === 13) {
      event.preventDefault();
      $.ajax({ // Post comment
        type: 'POST',
        url: url,
        contentType: 'application/json',
        data: JSON.stringify({
          "comment": this.state.comment,
          'messageId': this.props.messageId,
          "token": this.props.token,
        }),
        success: function(d){
          console.log('POST successful: ', d);
        }
      });
      this.setState({comment: ''}); // Clear comment box
      console.log(this.state);
    }
  },

  // two-way binding commentBox's value and this.state.comment
  render: function() {
    return (
        <div className="input-group" style = {{padding: '15px'}}>
          <input value={this.state.comment} onChange={this.handleChange} onKeyDown={this.enterPressed} type="text" className="form-control" placeholder="Enter your comment here."/>
          <span className="input-group-btn">
            <button onClick={this.handleClick} className="btn btn-success" type="button"> Submit </button>
          </span>
        </div>
    )
  }
});

module.exports = commentBox;
