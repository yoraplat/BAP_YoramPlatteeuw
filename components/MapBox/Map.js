import React, { useState, useEffect } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, View, Text, SafeAreaView, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons';

export function Map({ posts }) {

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

  const [data, setData] = useState(null);

  useEffect(() => {
    posts != undefined ? loadCoordinates() : '';
  }, [posts]);

  const loadCoordinates = () => {
    const coordinatesList = [];
    posts.forEach(post => {
      const postObject = {
        title: post.title,
        description: post.description,
        type: post.type,
        address: {
          latitude: parseFloat(post.address.latitude),
          longitude: parseFloat(post.address.longitude),
          string: post.address.string,
        },
      };
      // console.log(postObject)
      coordinatesList.push(postObject)
    });

    setData(coordinatesList)
  }

  return (
    <SafeAreaView>
      <MapView
        initialRegion={{
          latitude: 51.042479510131116,
          longitude: 3.7239200737682174,
          latitudeDelta: .05,
          longitudeDelta: .005
        }}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={generatedMapStyle}
      >
        {data && data.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.address.latitude,
              longitude: marker.address.longitude,
            }}
            title={marker.title}
            description={marker.description}
          >
            <FontAwesomeIcon icon={faMapMarker} style={{ color: "#6C0102" }} />
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