import React, { useState, useEffect, useRef } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, Modal, Image, Text, View, Animated, SafeAreaView, TouchableOpacity, TouchableHighlight, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarker, faShoppingBasket, faTimesCircle, faSeedling, faLeaf } from '@fortawesome/free-solid-svg-icons';
import overlayStyles from './overlayStyles'
import { MapItemOverlay } from './MapItemOverlay';
import moment from 'moment';
import { useFirestore } from '../../Services';
import { useAuth } from '../../Services';
import theme from '../../Theme/theme.style';

export function Map({ posts, selectedQuickFilter, location }) {

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
  const [imageUrl, setImageUrl] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  // const [quickFilter, setQuickFilter] = useState(selectedQuickFilter);
  const quickFilter = selectedQuickFilter

  const { buyItem, checkAvailable, createPickupCode, imageDownloadUrl } = useFirestore()
  const { user_id } = useAuth()

  const fadeAnim = useRef(new Animated.Value(0.01)).current;

  useEffect(() => {
    // setQuickFilter(selectedQuickFilter);
    posts != undefined ? loadCoordinates() : '';
  }, [posts, quickFilter]);


  const getDetails = async (index) => {
    setSelectedPost(index + 1)

    let id = data[index].id
    const response = await imageDownloadUrl(id)
    setImageUrl(response)

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }


  const closeOverlay = () => {
    setSelectedPost(null)
  }

  const openModal = () => {
    // setModalData(data[selectedPost - 1]);

    // console.log("Selected post: " + (selectedPost - 1))

    closeOverlay();
    // setModalVisible(true)
  }

  const loadCoordinates = () => {
    const coordinatesList = [];
    posts.forEach((post) => {
      const postObject = {
        title: post.title,
        description: post.description,
        type: post.type,
        price: post.price > 0 ? post.price : 'Gratis',
        amount: post.amount == undefined ? 1 : post.amount,
        pickup: post.pickup,
        veggie: post.veggie,
        vegan: post.vegan,
        latitude: parseFloat(post.coordinates.latitude),
        longitude: parseFloat(post.coordinates.longitude),
        address: post.address,
        id: post.id,
        image: post.image,
        seller_id: post.seller_id
      };

    coordinatesList.push(postObject)
    });
    setData(coordinatesList)
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: .05,
          longitudeDelta: .005
        }}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={generatedMapStyle}
        toolbarEnabled={false}
      >
        {data && data.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => getDetails(index)}
          >
            <FontAwesomeIcon icon={faMapMarker} style={{ color: theme.MAP_MARKER }} />
          </Marker>
        ))}
      </MapView>

      {
        selectedPost
          ? <Animated.View style={[styles.overlayContainer, { opacity: fadeAnim }]}>
            <MapItemOverlay post={data[selectedPost - 1]} closeOverlayFunction={() => closeOverlay()} openModalFunction={() => openModal()} />
          </Animated.View>
          : null

      }
      

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: theme.NEUTRAL_BACKGROUND,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    // top: '-30%',
    top: -150,
    zIndex: 50,
  },
  overlayContainer: {
    flex: 1,
    bottom: 30,
    zIndex: 51,
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
});