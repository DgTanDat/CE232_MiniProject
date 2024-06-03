// Create the charts when the web page loads
window.addEventListener('load', onload);

function onload(event){
  chartT = createTemperatureChart();
  chartH = createHumidityChart();
  chartR = createRainChart();
}

// Create Temperature Chart
function createTemperatureChart() {
  var chart = new Highcharts.Chart({
    chart:{ 
      renderTo:'chart-temperature',
      type: 'spline' 
    },
    series: [
      {
        name: 'DHT22'
      }
    ],
    title: { 
      text: undefined
    },
    plotOptions: {
      line: { 
        animation: false,
        dataLabels: { 
          enabled: true 
        }
      }
    },
    xAxis: {
      title: { 
        text: 'Time' 
      }
    },
    yAxis: {
      title: { 
        text: 'Temperature Celsius Degrees' 
      }
    },
    credits: { 
      enabled: false 
    }
  });
  return chart;
}

// Create Humidity Chart
function createHumidityChart(){
  var chart = new Highcharts.Chart({
    chart:{ 
      renderTo:'chart-humidity',
      type: 'spline'  
    },
    series: [{
      name: 'DHT22'
    }],
    title: { 
      text: undefined
    },    
    plotOptions: {
      line: { 
        animation: false,
        dataLabels: { 
          enabled: true 
        }
      },
      series: { 
        color: '#50b8b4' 
      }
    },
    xAxis: {
      title: { 
        text: 'Time' 
      }
    },
    yAxis: {
      tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      title: { 
        text: 'Humidity (%)' 
      }
    },
    credits: { 
      enabled: false 
    }
  });
  return chart;
}

// Create Rain Chart
function createRainChart(){
  var chart = new Highcharts.Chart({
    chart:{ 
      renderTo:'chart-rain',
      type: 'spline'  
    },
    series: [{
      name: 'Rain sensor'
    }],
    title: { 
      text: undefined
    },    
    plotOptions: {
      line: { 
        animation: false,
        dataLabels: { 
          enabled: true 
        }
      },
      series: { 
        color: '#50b8b4' 
      }
    },
    xAxis: {
      title: { 
        text: 'Time' 
      }
    },
    yAxis: {
      tickPositions: [0, 1, 2, 3, 4],
      title: { 
        text: 'Rain' 
      }
    },
    credits: { 
      enabled: false 
    }
  });
  return chart;
}

