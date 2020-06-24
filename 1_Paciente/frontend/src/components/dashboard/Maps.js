import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "shards-react";
import { TileLayer, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { MapStyled } from "./styles";
import { UseGetApiURL } from "../../services/apiService";

function Map() {
  const [positives, setPositives] = useState([]);

  useEffect(() => {
    let endPointComplete =
      "https://cors-anywhere.herokuapp.com/https://stepesbdmedrecords.herokuapp.com/api/positive-map";
    UseGetApiURL(endPointComplete).then(result => {
      setPositives(result.data);
    });
  }, []);

  return (
    <Card small className="h-100">
      <CardHeader className="border-bottom">
        <h6 className="m-0">Mapa de Contágio</h6>
      </CardHeader>
      <CardBody className="d-flex py-0">
        <MapStyled center={[-23.2282556, -45.8664576]} zoom={11}>
          <TileLayer
            attribution='&amp;copy <a href="https://github.com/stepesbd/ipbl2020">STEPES-BD</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup>
            {positives.map(positive => (
              <Marker
                key={positive._id}
                position={[
                  positive.data.Atendimento.Hospital.Exame_covid.Latitude,
                  positive.data.Atendimento.Hospital.Exame_covid.Longitude
                ]}
              />
            ))}
          </MarkerClusterGroup>
        </MapStyled>
      </CardBody>
    </Card>
  );
}

export default Map;
