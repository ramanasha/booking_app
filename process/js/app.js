var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');

var ControlHeader = require('./ControlHeader');
var BookingTable = require('./BookingTable/BookingTable');
var ViewBooking = require('./ViewBooking');
var AddBooking = require('./AddBooking/AddBooking');

var MainInterface = createReactClass({
  getInitialState: function() {
    return {
      today: moment(new Date()).format("YYYY-MM-DD"),
      dayQuery: moment(new Date()).format("YYYY-MM-DD"),
      data: [],
      bookingId:[],
      addFormVisibility: false,
      viewFormVisibility: false,
      addPitch: null,
    } 
  }, 
 
  componentDidMount: function() {
    this.serverRequest = $.get('./js/data.json', function(result) {
      this.setState({
        data: result 
      }); }.bind(this));

    document.querySelector('.loader').setAttribute('hidden', true);
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

  _deleteBooking: function () {
    var index = this.state.bookingId;
    var dataArray = this.state.data; 
    dataArray.splice(index, 1);
    this.setState({
      data: dataArray, 
    });
    this._updateClose();
  }, 

  _viewBooking: function (id, index, realIndex) { 
    console.log("view booking id: " + id);
    console.log("view booking index: " + index);
    console.log("view booking real index: " + realIndex);
    this.setState({
      viewFormVisibility: true,
      bookingId: realIndex, 
      addFormVisibility: false, 
    })
  },

  _updateBooking: function (updatedBooking) {
    var partialState = {};
    this.state.data[this.state.bookingId] = updatedBooking;
    this.setState(partialState);

    this.setState({
      bookingId: null,
      viewFormVisibility: false,
    }) 
  }, 

  _updateClose: function () {
    this.setState({
      bookingId: null, 
      viewFormVisibility: false,
    })
  },
  
  _addDisplay: function (addPitch) {
    var currentState = !this.state.addFormVisibility;
    var pitch =  addPitch;
    console.log(pitch);
    this.setState({
      addFormVisibility: currentState,
      addPitch: pitch
    })
  }, 

  _prettyDate: function (sqlDate) {
    return moment(sqlDate).format('ddd, D MMM');
  },
    
  render: function() {  
    if(this.state.viewFormVisibility) {
      var view = <ViewBooking 
        viewFormVisibility={this.state.viewFormVisibility}
        booking={this.state.data[this.state.bookingId]}
        updateBooking={this._updateBooking}
        updateClose={this._updateClose}
        deleteBooking={this._deleteBooking} 
      />
    } else { 
      var view = null
    } 

    if (this.state.addFormVisibility) {
      var visibilityVariable = <AddBooking dayQuery={this.state.dayQuery} addDisplay={this._addDisplay} addPitch={this.state.addPitch} addBooking={this._addBooking} />
    } 
 
    return (  
          <div>
            <ControlHeader 
              changeDay={this._changeDay} 
              today={this.state.today} 
              dayQuery={this.state.dayQuery}
              prettyDate={this._prettyDate} 
              addDisplay={this._addDisplay} 
            />
            <BookingTable 
              deleteBooking={this._deleteBooking} 
              viewBooking={this._viewBooking} 
              bookingData={this.state.data} 
              dayQuery={this.state.dayQuery}
              prettyDate={this._prettyDate} 
              addDisplay={this._addDisplay}
            />
            {view} 
            {visibilityVariable}

        </div> 
      )  
    }      
});   
   
ReactDOM.render( 
  <MainInterface />,   
  document.getElementById('app')    
);        
 