import { StyleSheet, StatusBar } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ACC8FF',
    marginTop: StatusBar.currentHeight,
    paddingTop: 100,
    width: '100%'
  },
  list: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  form: {
    width: "90%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20
  },
  formItem: {
    marginBottom: 20
  },
  title: {
    fontFamily: "Poppins_700Bold",
    color: "rgba(148, 2, 3, 1)",
    fontSize: 21,
  },

  button: {
    backgroundColor: "rgba(148, 2, 3, 1)",
    width: 50,
    height: 50,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  txtInput: {
    marginTop: 7,
    marginBottom: 7,
    padding: 10,
    fontSize: 16,
    borderRadius: 15,
    backgroundColor: '#EFF4FF',
    color: '#940203',
    fontFamily: "Poppins_400Regular",
  },
  bigButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 15,
    paddingRight: 30,
    backgroundColor: '#EFF4FF',
    marginTop: 5
  },
  bigButtonText: {
    color: '#C48086',
    fontFamily: "Poppins_400Regular",
    fontSize: 16
  },
  submitButton: {
    backgroundColor: 'rgba(148, 2, 3, 1)',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15
  },
  submitButtonTxt: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: "Poppins_400Regular",
  }
});

export default styles