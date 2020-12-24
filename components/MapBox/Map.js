import * as React from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, View, Text, SafeAreaView, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons';

export function Map() {
    
    const generatedMapStyle = [
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.business",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ]

    const markers = [
      {
        title: "Marker 1",
        coordinate: {
          latitude: 51.041114239744644,
          longitude: 3.715269560500076,
      },
    },
      {
        title: "Marker 2",
        coordinate: {
          latitude: 51.04515884500312,
          longitude: 3.728881750809316,
      },
    },
  ]
  return (
      <SafeAreaView>
          <MapView 
            initialRegion={{
                latitude: 51.042479510131116,
                longitude: 3.7239200737682174,
                latitudeDelta: .05,
                longitudeDelta: .005}}
            style={styles.map}
            provider = {PROVIDER_GOOGLE}
            customMapStyle = { generatedMapStyle }
          >
            {markers && markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{latitude: marker.coordinate.latitude,
              longitude: marker.coordinate.longitude,}}
              title={marker.title}
              description={"marked"}
            >
              <FontAwesomeIcon icon={faMapMarker} style={{color:"#6C0102"}}/>
              </Marker>

            ))}
          </MapView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});