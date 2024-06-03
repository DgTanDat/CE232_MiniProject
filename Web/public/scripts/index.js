// function to plot values on charts
function plotValues(chart, timestamp, value){
  var x = timestamp;
  var y = value ;
  if(chart.series[0].data.length > 24) {
    chart.series[0].addPoint([x, y], true, true, true);
  } else {
    chart.series[0].addPoint([x, y], true, false, true);
  }
}

// DOM elements
const loginElement = document.querySelector('#login-form');
const contentElement = document.querySelector("#content-sign-in");
const userDetailsElement = document.querySelector('#user-details');
const authBarElement = document.querySelector('#authentication-bar');
const viewDataButtonElement = document.getElementById('view-data-button');
const hideDataButtonElement = document.getElementById('hide-data-button');
const tableContainerElement = document.querySelector('#table-container');
const loadDataButtonElement = document.getElementById('load-data');

// DOM elements for sensor readings
const cardsReadingsElement = document.querySelector("#cards-div");
const chartsDivElement = document.querySelector('#charts-div');
const tempElement = document.getElementById("temp");
const humElement = document.getElementById("hum");
const rainElement = document.getElementById("rain");
const brnsElement = document.getElementById("brns");
const modeElement = document.getElementById("mode");
const updateElement = document.getElementById("lastUpdate");


// MANAGE LOGIN/LOGOUT UI
const setupUI = (user) => {
  if (user) {
    //toggle UI elements
    loginElement.style.display = 'none';
    contentElement.style.display = 'block';
    authBarElement.style.display ='block';
    userDetailsElement.style.display ='block';
    userDetailsElement.innerHTML = user.email;

    // get user UID to get data from database
    var uid = user.uid;
    console.log(uid);

    // Database references
    var dbRef = firebase.database().ref('MiniProject');
    
    // CHARTS
    chartT = createTemperatureChart();
    chartH = createHumidityChart();
    chartR = createRainChart();

    dbRef.orderByKey().limitToLast(25).on('value', function(snapshot) {
      if (snapshot.exists()) {
        snapshot.forEach(element => {
          var jsonData = element.toJSON();
          var temp = jsonData.temperature;
          var humid = jsonData.humidity;
          var tstmp = jsonData.timeStamp;
          var rain = jsonData.rain;
          plotValues(chartT, tstmp, temp);
          plotValues(chartH, tstmp, humid);
          plotValues(chartR, tstmp, rain);
        });
      }
    });

    // CARDS
    // Get the latest readings and display on cards
    dbRef.orderByKey().limitToLast(1).on('child_added', snapshot =>{
      var jsonData = snapshot.toJSON(); 
      var temperature = jsonData.temperature;
      var humidity = jsonData.humidity;
      var rain = jsonData.rain;
      var timest = jsonData.timeStamp
      // Update DOM elements
      tempElement.innerHTML = temperature;
      humElement.innerHTML = humidity;
      rainElement.innerHTML = rain;
      updateElement.innerHTML = timest;
    });

    // TABLE
    var lastReadingTimestamp; //saves last timestamp displayed on the table
    // Function that creates the table with the first 100 readings
    function createTable(){
      $('#tbody').empty();
      // append all data to the table
      dbRef.orderByKey().limitToLast(10).on('child_added', function(snapshot) {
        if (snapshot.exists()) {
          var jsonData = snapshot.toJSON();
          console.log(jsonData);
          var temperature = jsonData.temperature;
          var humidity = jsonData.humidity;
          var timestamp = jsonData.timeStamp;
          var rain = jsonData.rain;
          var content = '';
          content += '<tr>';
          content += '<td>' + timestamp + '</td>'; 
          content += '<td>' + temperature + '</td>';
          content += '<td>' + humidity + '</td>';
          content += '<td>' + rain + '</td>';
          content += '</tr>';
          $('#tbody').prepend(content);
        }
      });
    };

    // append readings to table (after pressing More results... button)
    function appendToTable(){
      $('#tbody').empty();
      console.log("APEND");
      var rows = [];
      dbRef.orderByKey().limitToLast(100).on('value', function(snapshot) {
        // convert the snapshot to JSON
        if (snapshot.exists()) {
          snapshot.forEach(element => {
            var jsonData = element.toJSON();
            var temperature = jsonData.temperature;
            var humidity = jsonData.humidity;
            var timestamp = jsonData.timeStamp;
            var rain = jsonData.rain;
            var content = '';
            content += '<tr>';
            content += '<td>' + timestamp + '</td>';
            content += '<td>' + temperature + '</td>';
            content += '<td>' + humidity + '</td>';
            content += '<td>' + rain + '</td>';
            content += '</tr>';
            rows.push(content);
          });
          rows.reverse();
          rows.forEach(row => {
            $('#tbody').append(row);
          });
        }
      });
    }

    viewDataButtonElement.addEventListener('click', (e) =>{
      // Toggle DOM elements
      tableContainerElement.style.display = 'block';
      viewDataButtonElement.style.display ='none';
      hideDataButtonElement.style.display ='inline-block';
      loadDataButtonElement.style.display = 'inline-block';
      createTable();
    });

    loadDataButtonElement.addEventListener('click', (e) => {
      appendToTable();
    });

    hideDataButtonElement.addEventListener('click', (e) => {
      tableContainerElement.style.display = 'none';
      viewDataButtonElement.style.display = 'inline-block';
      hideDataButtonElement.style.display = 'none';
      loadDataButtonElement.style.display = 'none'
    });

  // IF USER IS LOGGED OUT
  } else{
    // toggle UI elements
    loginElement.style.display = 'block';
    authBarElement.style.display ='none';
    userDetailsElement.style.display ='none';
    contentElement.style.display = 'none';
  }
}