const driver = require('bigchaindb-driver');
const BigchainDB = require( '../config/dbBigchainDB' );
const BigchainDB_API_PATH = 'http://' + BigchainDB.IP + ':9984/api/v1/'

var map;

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -23.213361, lng: -45.887588 },
    zoom: 13,
    streetViewControl: false
  });
  
  
  var markers = await bigchain.collection('assets').find( {'data.Atendimento.Hospital.Exame_covid.Resultado': 'POSITIVO'}).project({'data.Atendimento.Hospital.Exame_covid':true}).toArray();

  for (var i = 0; i < markers.length; i++) {
    let patientName = markers[i].data.Atendimento.Hospital.Exame_covid.Paciente;
    let latitude = parseFloat(markers[i].data.Atendimento.Hospital.Exame_covid.Latitude);
    let longitude = parseFloat(markers[i].data.Atendimento.Hospital.Exame_covid.Longitude);
    dropMarker(latitude, longitude, patientName);
  }
}

function dropMarker(lat, lng, patientName) {
  var location = { lat: lat, lng: lng };
  var contentString = "<h6>" + patientName + "</h6>";
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  })
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    title: patientName
  });
  marker.addListener('click', function () {
    infowindow.open(map, marker);
  });
}

