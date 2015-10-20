var React = require('react');
// var url = 'http://104.236.172.91:80/';
var url = 'http://104.131.139.49:80/';

var SearchBox = React.createClass({
  getInitialState: function() {
    return {
      query: ''
    };
  },
  // Update query value whenever user changes the query in the search box
  handleChange: function(event){
    if(event.target.value.length <= 150) { // query cannot be longer than 150 characters
      if (event.target.value.keyCode == 13) { // "Enter"
        this.handleClick;
      }

      this.setState({
        'query': event.target.value
      });
    }
  },

  enterPressed: function(event) {
    if(event.keyCode === 13) {
      event.preventDefault();
      $.ajax({ // Post query
        type: 'POST',
        url: url + 'search', //send a post request to localhost:4000/search/
        contentType: 'application/json',
        data: JSON.stringify({ "query": this.state.query }),
        success: function(d){
          console.log('POST successful: ', d);
        }
      });
      this.setState({query: ''}); // Clear search box
      console.log(this.state);
    }
  },

  // Post a query when "Submit" button is clicked
  handleClick: function(event){
    event.preventDefault();
    $.ajax({ // Post query
      type: 'POST',
      url: url + 'search',
      contentType: 'application/json',
      // headers: {'Cookie' : document.cookie },
      data: JSON.stringify({
        "uid": this.props.auth.uid,
        "query": this.state.query,
        "token": this.props.token
      }
      ),
      success: function(d){
        console.log('POST successful: ', d);
      }
    });
    this.setState({query: ''}); // Clear input box
    console.log(this.state);
  },
  // two-way binding inputbox's value and this.state.query
  render: function() {
    return (
      <div className="input-group" style = {{padding: '15px'}}>
        <input value={this.state.query} onChange={this.handleChange} onKeyDown={this.enterPressed} type="text" className="form-control"  placeholder="Search for something" />
        <span className="input-group-btn">
          <button onClick={this.handleClick} className="btn btn-success" type="button"> Submit </button>
        </span>
      </div>
    )
  }
});

module.exports = SearchBox;
