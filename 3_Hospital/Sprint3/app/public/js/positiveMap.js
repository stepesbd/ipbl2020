const driver = require('bigchaindb-driver');
const BigchainDB = require( '../config/dbBigchainDB' );
const BigchainDB_API_PATH = 'http://' + BigchainDB.IP + ':9984/api/v1/'

var map;

function initMap() {
  const bigchain = BigchainDB.getDb();
  const conn = new driver.Connection(BigchainDB_API_PATH)

  

  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -23.213361, lng: -45.887588 },
    zoom: 13,
    streetViewControl: false
  });
  
  
  var markers = await bigchain.collection('assets').find( {'data.Atendimento.Hospital.Exame_covid.Resultado': 'POSITIVO'}).project({'data.Atendimento.Hospital.Exame_covid':true}).toArray();
  //var markers = [{"_id":"5ee0f7b7e4f31415c1f12b8e","data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"Bernando Campos","Resultado":"POSITIVO","Latitude":"-23.1749555","Longitude":"-45.8833062","Data":"10/06/2020","Unix_time":1591801783}}}}},{"_id":"5ee0f982e4f31415c1f12d5c","data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"Algusto José","Resultado":"POSITIVO","Latitude":"-23.1755434","Longitude":"-45.8901372","Data":"10/06/2020","Unix_time":1591802242}}}}},{"_id":"5ee0ff98e4f31415c1f13364","data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"Juan Dantas","Resultado":"POSITIVO","Latitude":"-23.1817952","Longitude":"-45.8834001","Data":"10/06/2020","Unix_time":1591803800}}}}},{"_id":"5ee0fff3e4f31415c1f133c4","data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"Juan Dantas","Resultado":"POSITIVO","Latitude":"-23.1817952","Longitude":"-45.8834001","Data":"10/06/2020","Unix_time":1591803891}}}}},{"_id":"5ee10136e4f31415c1f13514","data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"Benedito da Silva","Resultado":"POSITIVO","Latitude":"-23.1764511","Longitude":"-45.8884048","Data":"10/06/2020","Unix_time":1591804213}}}}},{"_id":"5ee1014ee4f31415c1f13533","data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"Algusto José","Resultado":"POSITIVO","Latitude":"-23.1749555","Longitude":"-45.8833062","Data":"10/06/2020","Unix_time":1591804237}}}}},{"_id":"5ee11610e4f31415c1f1499a","data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"Bernando Campos","Resultado":"POSITIVO","Latitude":"-23.1817952","Longitude":"-45.8834001","Data":"10/06/2020","Unix_time":1591809552}}}}},{"_id":"5ee11738e4f31415c1f14ac4","data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"Marcelo Albuquerque","Resultado":"POSITIVO","Latitude":"-23.223701","Longitude":"-45.9009074","Data":"10/06/2020","Unix_time":1591809847}}}}},{"_id":"5ee11ef0e4f31415c1f15258","data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"Francisco de Paula","Resultado":"POSITIVO","Latitude":"-23.223701","Longitude":"-45.9009074","Data":"10/06/2020","Unix_time":1591811824}}}}},{"_id":"5ee1223ee4f31415c1f1559b","data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"Marcelo Albuquerque","Resultado":"POSITIVO","Latitude":"-23.1817952","Longitude":"-45.8834001","Data":"10/06/2020","Unix_time":1591812669}}}}},{"_id":"5ee122f6e4f31415c1f15658","data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"Joana Darc","Resultado":"POSITIVO","Latitude":"-23.1817952","Longitude":"-45.8834001","Data":"10/06/2020","Unix_time":1591812853}}}}},{"_id":"5ee12538e4f31415c1f1589f","data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"Joana Darc","Resultado":"POSITIVO","Latitude":"-23.223701","Longitude":"-45.9009074","Data":"10/06/2020","Unix_time":1591813432}}}}},{"_id":"5ee12699e4f31415c1f15a0a","data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"Juan Dantas","Resultado":"POSITIVO","Latitude":"-23.223701","Longitude":"-45.9009074","Data":"10/06/2020","Unix_time":1591813785}}}}},{"data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"Francisco de Paula","Resultado":"POSITIVO","Latitude":"-23.1817952","Longitude":"-45.8834001","Data":"10/06/2020","Unix_time":1591814556}}}}},{"data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"Maria Joaquina","Resultado":"POSITIVO","Latitude":"-23.1965183","Longitude":"-45.8669986","Data":"10/06/2020","Unix_time":1591814630}}}}},{"data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"Maria Joaquina","Resultado":"POSITIVO","Latitude":"-23.1769519","Longitude":"-45.8896501","Data":"10/06/2020","Unix_time":1591815144}}}}},{"data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"Algusto José","Resultado":"POSITIVO","Latitude":"-23.1749555","Longitude":"-45.8833062","Data":"10/06/2020","Unix_time":1591815603}}}}},{"data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"Bernando Campos","Resultado":"POSITIVO","Latitude":"-23.1764511","Longitude":"-45.8884048","Data":"10/06/2020","Unix_time":1591815999}}}}},{"data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"Etelvina Alves","Resultado":"POSITIVO","Latitude":"-23.1965183","Longitude":"-45.8669986","Data":"10/06/2020","Unix_time":1591816256}}}}},{"data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"Francisco de Paula","Resultado":"POSITIVO","Latitude":"-23.1817952","Longitude":"-45.8834001","Data":"10/06/2020","Unix_time":1591818820}}}}},{"data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"1","Resultado":"POSITIVO","Latitude":"-23.1769519","Longitude":"-45.8896501","Data":"10/06/2020","Unix_time":1591836206}}}}},{"data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"1","Resultado":"POSITIVO","Latitude":"-23.1749555","Longitude":"-45.8833062","Data":"10/06/2020","Unix_time":1591838902}}}}},{"data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"1","Resultado":"POSITIVO","Latitude":"-23.1764511","Longitude":"-45.8884048","Data":"11/06/2020","Unix_time":1591877216}}}}},{"data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"1","Resultado":"POSITIVO","Latitude":"-23.1769519","Longitude":"-45.8896501","Data":"11/06/2020","Unix_time":1591877296}}}}},{"data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"1","Resultado":"POSITIVO","Latitude":"-23.1755434","Longitude":"-45.8901372","Data":"11/06/2020","Unix_time":1591877468}}}}},{"data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"1","Resultado":"POSITIVO","Latitude":"-23.1764511","Longitude":"-45.8884048","Data":"11/06/2020","Unix_time":1591877628}}}}},{"data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"1","Resultado":"POSITIVO","Latitude":"-23.1769519","Longitude":"-45.8896501","Data":"11/06/2020","Unix_time":1591877824}}}}},{"data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"1","Resultado":"POSITIVO","Latitude":"-23.1817952","Longitude":"-45.8834001","Data":"11/06/2020","Unix_time":1591877983}}}}},{"data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"1","Resultado":"POSITIVO","Latitude":"-23.1749555","Longitude":"-45.8833062","Data":"11/06/2020","Unix_time":1591878069}}}}},{"data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"1","Resultado":"POSITIVO","Latitude":"-23.223701","Longitude":"-45.9009074","Data":"11/06/2020","Unix_time":1591878277}}}}},{"data":{"Atendimento":{"Hospital":{"Exame_covid":{"Paciente":"1","Resultado":"POSITIVO","Latitude":"-23.1769519","Longitude":"-45.8896501","Data":"11/06/2020","Unix_time":1591878434}}}}}];

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

