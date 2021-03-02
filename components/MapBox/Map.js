import React, { useState, useEffect, useRef } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, Modal, Image, Text, View, Animated, SafeAreaView, TouchableOpacity, TouchableHighlight, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarker, faShoppingBasket, faTimesCircle, faSeedling, faLeaf } from '@fortawesome/free-solid-svg-icons';
import overlayStyles from './overlayStyles'
import { MapItemOverlay } from './MapItemOverlay';
import moment from 'moment';
import { useFirestore } from '../../Services';
import theme from '../../Theme/theme.style';

export function Map({ posts, selectedQuickFilter }) {

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
  const [quickFilter, setQuickFilter] = useState(selectedQuickFilter);

  const { buyItem, checkAvailable, createPickupCode, imageDownloadUrl } = useFirestore();

  const fadeAnim = useRef(new Animated.Value(0.01)).current;

  useEffect(() => {
    setQuickFilter(selectedQuickFilter);
    posts != undefined ? loadCoordinates() : '';
  }, [posts]);


  const getDetails = async (index) => {
    setSelectedPost(index + 1)

    // console.log("Index: " + index)

    // if (data[index].image != false) {
      let id = data[index].id
      const response = await imageDownloadUrl(id)
      setImageUrl(response)
    // }

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
    setModalData(data[selectedPost - 1]);

    // console.log("Selected post: " + (selectedPost - 1))

    closeOverlay();
    setModalVisible(true)
  }

  const confirmPurchase = async (listingId) => {
    try {
      // Check if still available
      console.log("Checking if available")
      const available = await checkAvailable(listingId)

      if (available != false) {
        // Create a pickup code
        await createPickupCode(listingId)
        console.log("Created pickup code")

        // Buy the item
        await buyItem(listingId)
        console.log("Bought item")

        // console.log("Creating code and buying item")
        setModalVisible(!modalVisible)
      }


    } catch (e) {
      console.log(e.message)
      setModalVisible(!modalVisible)
      // alert("Item is niet meer beschikbaar.")
    }
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
        image: post.image
      };

      // Filtering for veggie/vegan meals/food
      // Veggie == vegan, vegan != veggie
      if (quickFilter[0] == true && post.veggie == true) {

        // meals
        if (quickFilter[0] == true && post.veggie == true && quickFilter[2] == true && post.type == 'meal') {
          coordinatesList.push(postObject)
        }
        // food
        if (quickFilter[0] == true && post.veggie == true && quickFilter[3] == true && post.type == 'food') {
          coordinatesList.push(postObject)
        }

        // All veggie/vegan
        if (quickFilter[0] == true && quickFilter[2] == false && quickFilter[3] == false && post.veggie == true) {
          coordinatesList.push(postObject)
        }
      }

      // Filtering for vegan meals/food
      if (quickFilter[1] == true && post.vegan == true) {

        // meals
        if (quickFilter[2] == true && post.type == 'meal') {
          coordinatesList.push(postObject)
        }
        // food
        if (quickFilter[3] == true && post.type == 'food') {
          coordinatesList.push(postObject)
        }

        // All veggie/vegan
        if (quickFilter[2] == false && quickFilter[3] == false) {
          coordinatesList.push(postObject)
        }
      }

      // only meals
      if (quickFilter[0] == false && quickFilter[1] == false && quickFilter[2] == true && quickFilter[3] == false) {
        if (post.type == 'meal') {
          coordinatesList.push(postObject)
        }
      }

      // only food
      if (quickFilter[0] == false && quickFilter[1] == false && quickFilter[2] == false && quickFilter[3] == true) {
        if (post.type == 'food') {
          coordinatesList.push(postObject)
        }
      }

      // No filters selected
      if (quickFilter[0] == false && quickFilter[1] == false && quickFilter[2] == false && quickFilter[3] == false) {
        coordinatesList.push(postObject)
      }
    });
    setData(coordinatesList)
  }

  return (
    <SafeAreaView style={styles.container}>
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
      {
        modalVisible
          ?
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
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
                    <FontAwesomeIcon icon={faTimesCircle} style={{ color: theme.PRIMARY_COLOR }} size={30} />
                  </TouchableOpacity>
                </View>
                <Text style={overlayStyles.description}>{modalData.description}</Text>
                <View style={overlayStyles.info}>
                  <View style={overlayStyles.infoBuyList}>
                    <Text style={overlayStyles.infoBuyItem}>Prijs: {modalData.price}</Text>
                    <Text style={overlayStyles.infoBuyItem}>Aantal: {modalData.amount}</Text>
                    <Text style={overlayStyles.infoBuyItem}>Afhalen: {moment((modalData.pickup).toDate()).format('DD/MM/YYYY' + ', ' + 'hh:mm')}u</Text>
                    <Text style={overlayStyles.infoBuyItem}>Adres: {modalData.address}</Text>
                    {modalData.image != null
                      ? <Image
                        style={[overlayStyles.contentImage, overlayStyles.infoBuyItemImage]}
                        resizeMode={"contain"}
                        source={{
                          uri: modalData.image ? imageUrl : null
                        }}
                      />
                      : null
                    }
                  </View>
                </View>
                <TouchableHighlight
                  style={overlayStyles.submitButton}
                  onPress={() => {
                    confirmPurchase(modalData.id);
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
    // backgroundColor: theme.NEUTRAL_BACKGROUND,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    top: '-30%',
    zIndex: 50,
  },
  overlayContainer: {
    flex: 1,
    bottom: 60,
    zIndex: 51,
    position: 'absolute',
    width: '100%',
    alignItems: 'center'
  },
});