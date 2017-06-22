var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');

var ControlHeader = require('./ControlHeader');
var BookingTable = require('./BookingTable/BookingTable');
var ViewBooking = require('./ViewBooking');
var AddBooking = require('./AddBooking');

var MainInterface = createReactClass({
  getInitialState: function() {
    return {
      today: moment(new Date()).format("YYYY-MM-DD"),
      dayQuery: moment(new Date()).format("YYYY-MM-DD"),
      data: [],
      addFormVisibility: false,
      viewFormVisibility: false,
    } 
  }, 
 
  componentDidMount: function() {
    this.serverRequest = $.get('./js/data.json', function(result) {
      this.setState({
        data: result 
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  }, 
 
  _changeDay: function(date) {
    this.setState({dayQuery: date})
  }, 

  _addBooking: function(temptBooking) {
    var temptData = this.state.data;
    temptData.push(temptBooking);
    this.setState({ 
      data: temptData, 
      addFormVisibility: false, 
    });
  },

  _deleteBooking: function (item) {
    var dataArray = this.state.data;
    dataArray.splice(item, 1);
    this.setState({
      data: dataArray,
    });
  },

  _viewBooking: function (itemIndex) { 
    this.setState({
      viewFormVisibility: true,
      bookingIndex: itemIndex, 
    })
  },

  _updateBooking: function (updatedBooking) {
    var partialState = {};
    this.state.data[this.state.bookingIndex] = updatedBooking;
    this.setState(partialState);

    this.setState({
      bookingIndex: null,
      viewFormVisibility: false,
    })
  },

  _updateClose: function () {
    this.setState({
      bookingIndex: null,
      viewFormVisibility: false,
    })
  },
  
  _addDisplay: function () {
    var currentState = !this.state.addFormVisibility;
    this.setState({
      addFormVisibility: currentState
    })
  },
    
  render: function() { 
    if(this.state.viewFormVisibility) {
      var view = <ViewBooking 
        viewFormVisibility={this.state.viewFormVisibility}
        booking={this.state.data[this.state.bookingIndex]}
        updateBooking={this._updateBooking}
        updateClose={this._updateClose}
      />
    } else {
      var view = null
    }

    return (
          <div>
            <ControlHeader 
              changeDay={this._changeDay} 
              today={this.state.today} 
              dayQuery={this.state.dayQuery}
            />
            <BookingTable 
              deleteBooking={this._deleteBooking} 
              viewBooking={this._viewBooking} 
              bookingData={this.state.data} 
              dayQuery={this.state.dayQuery}
            />

            {view}

            <AddBooking  
              addBooking={this._addBooking} 
              addDisplay={this._addDisplay} 
              addFormVisibility={this.state.addFormVisibility}
            />
        </div> 
      ) 
    }      
});   
   
ReactDOM.render( 
  <MainInterface />,   
  document.getElementById('app')    
);        
