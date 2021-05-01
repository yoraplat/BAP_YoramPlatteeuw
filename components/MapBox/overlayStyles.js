import { StyleSheet, StatusBar } from 'react-native';
import theme from '../../Theme/theme.style';

const overlayStyles = StyleSheet.create({
  mapOverlay: {
    width: '90%',
  },
  topLine: {
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overlayTitle: {
    textAlign: 'left',
    color: theme.WHITE,
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },
  overlaySubtitle: {
    // textAlign: 'right',
    color: theme.WHITE,
    fontSize: 15,
    fontFamily: "Poppins_300Light",
  },
  overlayDescription: {
    fontSize: 15,
    textAlign: 'left',
    fontFamily: "Poppins_400Regular",
    color: theme.WHITE,
  },
  overlayVeggieIcon: {
    color: 'green',
  },
  infoList: {
    alignItems: "flex-start",
    alignContent: "flex-start",
    flexWrap: "wrap",
    flexDirection: 'row',
    width: '80%'
  },
  infoBuyList: {
    // alignItems: "flex-start",
    // alignContent: "flex-start",
    // flexWrap: "wrap",
    flexDirection: 'row',
    width: '100%'
  },
  infoItem: {
    width: "100%",
    backgroundColor: 'red',
    marginTop: 10,
    fontFamily: "Poppins_500Medium",
    color: theme.WHITE,
  },
  infoBuyItem: {
    // width: "90%",
    // marginTop: 5,
    fontFamily: "Poppins_500Medium",
    color: theme.PRIMARY_COLOR,
  },
  infoBuyItemImage: {
    width: "100%",
    marginTop: 10,
    // backgroundColor: 'red',
    alignContent: 'flex-start'
  },
  info: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  small: {
    textAlign: "right",
    width: '30%'
  },
  basketBtn: {
    backgroundColor: theme.BUTTON_BACKGROUND,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  closeBtn: {
    alignItems: 'flex-end',
    // borderRadius: 100,
    // backgroundColor: theme.WHITE,
  },

  title: {
    fontFamily: "Poppins_700Bold",
    color: theme.WHITE,
    fontSize: 21,
  },
  description: {
    fontSize: 15,
    marginTop: 5,
    marginBottom: 5,
    fontFamily: 'Poppins_400Regular',
    color: theme.WHITE,
  },
  infoList: {
    maxWidth: "100%",
    alignItems: "flex-start",
    alignContent: "flex-start",
    flexWrap: "wrap",
    flexDirection: 'row',

  },
  infoItem: {
    // width: "50%",
    marginTop: 0,
    margin: 5,
    marginLeft: 0,
    fontFamily: "Poppins_500Medium",
    color: theme.WHITE
  },
  buttonList: {
    // backgroundColor:"green"
    marginTop: -20,
  },
  info: {
    justifyContent: "space-around",
    flexDirection: "column",
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: theme.NEUTRAL_BACKGROUND,
    borderRadius: 20,
    padding: 25,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "90%"
  },
  submitButton: {
    backgroundColor: theme.PRIMARY_COLOR,
    borderRadius: 15,
    padding: 10,
    marginBottom: 5,
    marginTop: 15
  },
  submitButtonTxt: {
    color: theme.BUTTON_TXT_COLOR,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: "Poppins_400Regular",
  },
  contentImage: {
    height: 250,
    width: 500,
    borderRadius: 10,
    // marginTop: 10
  },

  overlay: {
    backgroundColor: theme.TRANSPARENT_POPUP,
    height: '100%',
    borderRadius: 15
  }

});

export default overlayStyles