import React, { useState, useEffect, useRef } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, Modal, Text, View, Animated, SafeAreaView, TouchableOpacity, TouchableHighlight, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarker, faShoppingBasket, faTimesCircle, faSeedling, faLeaf } from '@fortawesome/free-solid-svg-icons';
import overlayStyles from './overlayStyles'
import { MapItemOverlay } from './MapItemOverlay';
import moment from 'moment';

export function Map({ posts, selectedQuickFilter, updateFilter }) {

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

  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [quickFilter, setQuickFilter] = useState(selectedQuickFilter);

  const fadeAnim = useRef(new Animated.Value(0.01)).current;

  useEffect(() => {
    setQuickFilter(selectedQuickFilter);
    posts != undefined ? loadCoordinates() : '';
  }, [posts]);


  const getDetails = (index) => {
    setSelectedPost(index + 1)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }

  // const convertDate = (date) => {
  //   const months = {
  //     0: 'januari',
  //     1: 'februari',
  //     2: 'maart',
  //     3: 'april',
  //     4: 'mei',
  //     5: 'juni',
  //     6: 'juli',
  //     7: 'augustus',
  //     8: 'september',
  //     9: 'oktober',
  //     10: 'november',
  //     11: 'december'
  //   }
  //   const d = new Date(date * 1000);
  //   const day = d.getDay();
  //   const month = months[d.getMonth()];
  //   const hour = d.getHours();
  //   const minutes = d.getMinutes();
  //   return `${day} ${month}, ${hour}:${minutes}u`
  // }

  const closeOverlay = () => {
    setSelectedPost(null)
  }

  const openModal = () => {
    setModalData(data[selectedPost - 1]);
    closeOverlay();
    setModalVisible(true)
    // console.log("Filter: " + quickFilter)
  }


  const loadCoordinates = () => {
    const coordinatesList = [];
    posts.forEach(post => {

      const postObject = {
        title: post.title,
        description: post.description,
        type: post.type,
        price: post.price > 0 ? post.price : 'Gratis',
        amount: post.amount == undefined ? 1 : post.amount,
        pickup: post.pickup,
        veggie: post.veggie,
        vegan: post.vegan,
        latitude: parseFloat(post.latitude),
        longitude: parseFloat(post.longitude),
        address: post.address,
        id: post.id
      };


      // Check if qfilter is veggie
      if (quickFilter == 1 && post.veggie == true) {
        coordinatesList.push(postObject)
      } if (quickFilter == 2 && post.vegan == true) {
        coordinatesList.push(postObject)
      } if (quickFilter == 0) {
        coordinatesList.push(postObject)
      }
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
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => getDetails(index)}
          >
            <FontAwesomeIcon icon={faMapMarker} style={{ color: "#6C0102" }} />
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
      {
        modalVisible
          ?
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            transparent={true}
          >
            <View style={overlayStyles.centeredView}>
              <View style={overlayStyles.modalView}>
                <View style={overlayStyles.topLine}>
                  <Text style={overlayStyles.title}>{modalData.title} <Text style={{ fontFamily: "Poppins_300Light", fontSize: 17 }}>({modalData.price})</Text></Text>

                  {modalData.veggie == true && modalData.vegan == false
                    ? <FontAwesomeIcon icon={faLeaf} style={{ color: 'green' }} size={30} />
                    : <></>
                  }
                  {modalData.vegan == true
                    ? <FontAwesomeIcon icon={faSeedling} style={{ color: 'green' }} size={30} />
                    : <></>
                  }

                  <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                    <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'rgba(148, 2, 3, 1)' }} size={30} />
                  </TouchableOpacity>
                </View>
                <Text style={overlayStyles.description}>{modalData.description}</Text>
                <View style={overlayStyles.info}>
                  <View style={overlayStyles.infoBuyList}>
                    <Text style={overlayStyles.infoBuyItem}>Prijs: {modalData.price}</Text>
                    {/* {
                      modalData.price == 'Gratis' && modalData.amount > 1
                      ? <Text style={overlayStyles.infoBuyItem}>Totale prijs: {modalData.price}</Text>
                      : <Text style={overlayStyles.infoBuyItem}>Totale prijs: {modalData.price * modalData.amount}</Text>
                    } */}
                    <Text style={overlayStyles.infoBuyItem}>Aantal: {modalData.amount}</Text>
                    <Text style={overlayStyles.infoBuyItem}>Afhalen: {moment((modalData.pickup).toDate()).format('DD/MM/YYYY' + ', ' + 'hh:mm')}u</Text>
                    {/* <Text style={overlayStyles.infoItem}>1,3 km</Text> */}
                    <Text style={overlayStyles.infoBuyItem}>Adres: {modalData.address}</Text>
                  </View>
                  <TouchableOpacity style={overlayStyles.button}>
                    <FontAwesomeIcon icon={faShoppingBasket} style={{ color: 'white' }} size={30} />
                  </TouchableOpacity>
                </View>
                <TouchableHighlight
                  style={overlayStyles.submitButton}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={overlayStyles.submitButtonTxt}>Voeding Redden</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
          : null
      }

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
  overlayContainer: {
    flex: 1,
    bottom: 60,
    position: 'absolute',
    width: '100%',
    alignItems: 'center'
  },
});