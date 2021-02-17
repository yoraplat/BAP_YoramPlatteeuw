import { StyleSheet, StatusBar } from 'react-native';
import theme from '../../Theme/theme.style';

const overlayStyles = StyleSheet.create({
  mapOverlay: {
    backgroundColor: theme.NEUTRAL_BACKGROUND,
    // height: 150,
    borderRadius: 25,
    padding: 15,
    width: '90%',
  },
  topLine: {
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overlayTitle: {
    textAlign: 'left',
    color: theme.PRIMARY_COLOR,
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },
  overlaySubtitle: {
    // textAlign: 'right',
    color: theme.PRIMARY_COLOR,
    fontSize: 15,
    fontFamily: "Poppins_300Light",
  },
  overlayDescription: {
    textAlign: 'left',
    fontFamily: "Poppins_400Regular",
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
    alignItems: "flex-start",
    alignContent: "flex-start",
    flexWrap: "wrap",
    flexDirection: 'row',
    width: '100%'
  },
  infoItem: {
    width: "60%",
    marginTop: 10,
    fontFamily: "Poppins_500Medium",
    color: theme.PRIMARY_COLOR,
  },
  infoBuyItem: {
    width: "90%",
    marginTop: 10,
    fontFamily: "Poppins_500Medium",
    color: theme.PRIMARY_COLOR,
  },
  infoBuyItemImage: {
    width: 200,
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
    backgroundColor: theme.PRIMARY_COLOR,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  closeBtn: {
    alignItems: 'flex-end',
    borderRadius: 100,
  },

  title: {
    fontFamily: "Poppins_700Bold",
    color: theme.PRIMARY_COLOR,
    fontSize: 21,
  },
  description: {
    fontSize: 12,
    marginTop: 5,
    marginBottom: 5,
    fontFamily: 'Poppins_400Regular',
    color: theme.GREY
  },
  infoList: {
    maxWidth: "80%",
    alignItems: "flex-start",
    alignContent: "flex-start",
    flexWrap: "wrap",
    flexDirection: 'row',

  },
  infoItem: {
    width: "50%",
    marginTop: 10,
    fontFamily: "Poppins_500Medium"
  },
  buttonList: {
    // backgroundColor:"green"
    marginTop: -20,
  },
  info: {
    justifyContent: "space-around",
    flexDirection: "row",
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
    padding: 35,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    maxWidth: 200,
    height: 200,
    borderRadius: 10,
    // marginTop: 10
  }

});

export default overlayStyles