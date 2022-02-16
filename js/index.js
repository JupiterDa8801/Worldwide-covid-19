var startDate = document.querySelector("#start");
var endDate = document.querySelector("#end");

function updateMap()
{
  fetch("https://api.covid19api.com/summary")
  .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var responseObject = data;
      var sentence = data.Global.TotalConfirmed.toString()
      const answer = document.getElementById('global-box');
      //console.log(sentence)


      answer.innerHTML = `<h3><u>Global Stat</u></h3><p><strong>Total Confirmed: <div id='confirm'>${data.Global.TotalConfirmed}</div></strong></p><p><strong>Total Deaths: <div id='death'>${data.Global.TotalDeaths}</div></strong></p>`;


      data.Countries.forEach(element =>
        {
          var confirmedMessage = element.TotalConfirmed;
          var deathMessage =  element.TotalDeaths;
          latLongMarking(element.Country, confirmedMessage, deathMessage)



        }
      )
    })

}


function updateTempBox(country)
{
  //console.log('hello');
  var startDateISO = new Date(startDate.value).toISOString();
  var endDateISO = new Date(endDate.value).toISOString();
  //console.log(endDateIso);
  fetch(`https://api.covid19api.com/country/${country}?from=${startDateISO}&to=${endDateISO}`)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    //...
    var totalDays = data.length;
    var confirmedCasesOnInitialDay = data[0].Confirmed;
    var confirmedCasesOnFinalDay = data[totalDays-1].Confirmed;
    var confirmedCasesRange = confirmedCasesOnFinalDay - confirmedCasesOnInitialDay;

    var deathCasesOnInitialDay = data[0].Deaths;
    var deathCasesOnFinalDay = data[totalDays-1].Deaths;
    var deathCasesRange = deathCasesOnFinalDay - deathCasesOnInitialDay;

    var confirmedMessage = confirmedCasesRange;
    var deathMessage = deathCasesRange;

    var tempBox = document.querySelector('#temp-box');
    tempBox.innerHTML = `<h3><u>${country}</u></h3><p><strong>Total Confirmed: <div id='confirm'>${confirmedMessage}</div></strong></p><p><strong>Total Deaths: <div id='death'>${deathMessage}</div></strong></p>`;
  })
}

function latLongMarking(country, confirmedMessage, deathMessage)
{
  var long = 0
  var lat = 0
  fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/"+country+".json?limit=2&access_token=pk.eyJ1IjoiYXNocnVrYW5hIiwiYSI6ImNremg1MjdpaTBocGYydnBkOXRpMmFpcTMifQ.5Ubu6yzrnGYnv0J55IZ8nQ")
  .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      long = data.features[0].center[0];
      lat = data.features[0].center[1];

      if(confirmedMessage<10000){
        color = "rgba(255, 0, 0, 0.2)";

      }
      else if(10000<confirmedMessage && confirmedMessage<100000){
        color = "rgba(255, 0, 0, 0.4)";
      }
      else if(100000<confirmedMessage && confirmedMessage<1000000){
        color = "rgba(255, 0, 0, 0.6)";
      }
      else if(1000000<confirmedMessage && confirmedMessage<10000000){
        color = "rgba(255, 0, 0, 0.8)";
      }
      else if (10000000<confirmedMessage){
        color = "rgba(255, 0, 0, 2)";
      }

      new mapboxgl.Marker({
      draggable: false,
      color: color
    })
    .setLngLat([long,lat])
    .setPopup(new mapboxgl.Popup().on('open', () => {
      const answer = document.getElementById('country-box');
      answer.innerHTML = `<h3><u>${country}</u></h3><p><strong>Total Confirmed: <div id='confirm'>${confirmedMessage}</div></strong></p><p><strong>Total Deaths: <div id='death'>${deathMessage}</div></strong></p>`;
      updateTempBox(country);
    }))
    .addTo(map);
    });
}

updateMap();
