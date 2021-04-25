import { StyleSheet, StatusBar } from 'react-native';
import theme from '../../Theme/theme.style';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: theme.SECONDARY_COLOR,
    // backgroundColor: theme.TERTIARY_COLOR,
    marginTop: StatusBar.currentHeight,
    paddingTop: 70,
    width: '100%',
  },
  list: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  form: {
    width: "90%",
    backgroundColor: theme.NEUTRAL_BACKGROUND,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20
  },
  formItem: {
    marginBottom: 20
  },
  title: {
    fontFamily: "Poppins_700Bold",
    color: theme.PRIMARY_COLOR,
    fontSize: 21,
  },
  text: {
    fontFamily: "Poppins_700Bold",
    color: theme.PRIMARY_COLOR,
    fontSize: 15,
    paddingLeft: 5,
  },

  button: {
    backgroundColor: theme.PRIMARY_COLOR,
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
    backgroundColor: theme.TXT_INPUT_BACKGROUND,
    color: theme.PRIMARY_COLOR,
    fontFamily: "Poppins_400Regular",
    marginRight: 10
  },
  bigButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 15,
    paddingRight: 30,
    backgroundColor: theme.TXT_INPUT_BACKGROUND,
    marginTop: 5
  },
  bigButtonText: {
    color: theme.TEXT_PLACEHOLDER,
    fontFamily: "Poppins_400Regular",
    fontSize: 16
  },
  submitButton: {
    // backgroundColor: theme.BUTTON_BACKGROUND,
    backgroundColor: theme.WHITE,
    borderRadius: 15,
    padding: 10,
    marginBottom: 15
  },
  submitButtonTxt: {
    // color: theme.BUTTON_TXT_COLOR,
    color: theme.PRIMARY_COLOR,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: "Poppins_400Regular",
  },
});

export default styles