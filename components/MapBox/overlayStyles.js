import { StyleSheet, StatusBar } from 'react-native';

const overlayStyles = StyleSheet.create({
  mapOverlay: {
    backgroundColor: 'white',
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
    color: 'rgba(148, 2, 3, 1)',
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },
  overlaySubtitle: {
    // textAlign: 'right',
    color: 'rgba(148, 2, 3, 1)',
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
    flexDirection: 'column',
    width: '80%'
  },
  infoItem: {
    width: "60%",
    marginTop: 10,
    fontFamily: "Poppins_500Medium",
    color: 'rgba(148, 2, 3, 1)',
  },
  infoBuyItem: {
    width: "90%",
    marginTop: 10,
    fontFamily: "Poppins_500Medium",
    color: 'rgba(148, 2, 3, 1)',
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
    backgroundColor: "rgba(148, 2, 3, 1)",
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
    color: "rgba(148, 2, 3, 1)",
    fontSize: 21,
  },
  description: {
    fontSize: 12,
    marginTop: 5,
    marginBottom: 5,
    fontFamily: 'Poppins_400Regular',
    color: "#707070"
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
    backgroundColor: 'white',
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
    backgroundColor: 'rgba(148, 2, 3, 1)',
    borderRadius: 15,
    padding: 10,
    marginBottom: 5,
    marginTop: 15
  },
  submitButtonTxt: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: "Poppins_400Regular",
  },
});

export default overlayStyles