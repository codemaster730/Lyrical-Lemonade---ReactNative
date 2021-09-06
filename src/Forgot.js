import React from 'react';
import {
    Platform,
    ScrollView,
    Text,
    View,
    Image,
    StyleSheet,
    Button,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
    StatusBar
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
  } from 'react-native-responsive-screen';

import { FORGOT_PWD } from './constants/constants';

import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { initialMode } from 'react-native-dark-mode';
 
const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage, 
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {
    // we'll talk about the details later.
  }
});
  

class Forgot extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isKeyboard: false,
            email: '',
            invalidEmail: true,
            spinnerState: false,
            wrong_email: 0,
            error: 'no error'
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
          'keyboardWillShow',
          this._keyboardDidShow.bind(this),
        );
        this.keyboardDidHideListener = Keyboard.addListener(
          'keyboardWillHide',
          this._keyboardDidHide.bind(this),
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow() {
        this.setState(prevS => ({
            isKeyboard: true
        }));
    }

    _keyboardDidHide() {
        this.setState(prevS => ({
            isKeyboard: false
        }));
    }

    _validEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    async _forgotPwd() { 
        var email = this.state.email;
        
        if(!this._validEmail(email) || email == '') {
            this.setState({invalidEmail: false});
            this.setState({spinnerState: false});
            return ;
        }else{
            this.setState({invalidEmail: true});
            
        }
        this.setState({spinnerState: true});
        var body = {
            email: email
        }

        await fetch(FORGOT_PWD, {
            method: "post",
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify(body),
        })
        .then(res => res.json())
        .then(resJson => {
            this.setState({error: JSON.stringify(resJson)});

            if(resJson.success) {
                this.setState({spinnerState: false});
                this.setState({"wrong_email": 1});
                this.showAlert();
            }else{
                this.setState({spinnerState: false});
                this.setState({"wrong_email": -1});
                this.showAlert1();
            }
        }).catch(error => {
            this.setState({error: JSON.stringify(error)});
            this.setState({spinnerState: false});
        });
    }

    showAlert() {
        setTimeout(() => {
        Alert.alert(
            "We have sent an email to your address",
            "If you don't find any mail, check your spam mail",
            [
              {
                text: 'OK', 
                onPress: () => this.props.navigation.navigate("Login")
              },
            ],
            {cancelable: false},
          );
        }, 100);


    }

    showAlert1 () {
        setTimeout(() => {
            Alert.alert(
                "You're not registed user",
                "Please sign up first",
                [
                  {
                    text: 'OK', 
                    onPress: () => this.props.navigation.navigate("SignUp")
                  },
                ],
                {cancelable: false},
              );
        }, 100);
    }

    render() {
        const isKeyboard = !this.state.isKeyboard;
        const emailInput = this.state.email;
        const invalidEmail = this.state.invalidEmail;
        const wrong_email = this.state.wrong_email;

        return (
            <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss} accessible={false}>
                <View style={{flex: 1}}>
                <StatusBar  barStyle="dark-content" translucent={true} />
                    <View style={{ marginTop: '15%'}}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Image resizeMode="contain" style={{marginLeft: '5%', width: 25, height: 25}} source={require('../images/arrow.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop: '7%', marginLeft: '5%', marginRight: '5%'}}>
                    <Spinner
                        visible={this.state.spinnerState}
                        textStyle={styles.spinnerTextStyle}                    
                    />
                        <TextInput style={{backgroundColor: '#fff', height: 50, borderRadius: 7, borderColor: '#000', borderWidth: 2, paddingLeft: 20, fontSize: 16, color: '#000'}} placeholder="type here your email you will receive password" placeholderTextColor="#777" onChangeText={ text => {
                                this.setState({"email" : text});
                            }} value={emailInput}  />
                    </View>
                    <View style={{marginTop: '5%'}}>
                        <TouchableOpacity onPress={() => this._forgotPwd()}> 
                            <View style={{backgroundColor: '#fafc00', height: 50, marginLeft: '5%', marginRight: '5%', borderRadius: 7, justifyContent: 'center', borderWidth: 2, borderColor: '#000'}}>
                                <Text style={{color: "#000", textAlign: 'center', fontSize: 20}}>Request Password</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={{marginTop: '5%'}}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Text style={{color: '#000', fontSize:15, textAlign: 'center', letterSpacing: 1, fontWeight:'bold'}}>SIGNIN</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default Forgot;

const styles1 = StyleSheet.create({
    container: {
        flex: 1
    },
    spinnerTextStyle: {
        color: '#fff'
    },
    logoImageContainer: {
        flex: 4,
        alignItems: 'center',
        // backgroundColor: '#FAFC00',
        paddingTop: '15%'
    },
        logoImage: {
            width: 55, 
            height: 100,
            // marginTop: '25%'
        },
    loginForm: {
        flex: 5,
        // backgroundColor: '#FAFC00'
    },
        leftIcon: {
            flex: 1,
            backgroundColor: '#000000',
            height: 42,
            width:42,
            justifyContent: 'center'
        },
        leftIconImage: {
            height: 20
        },  
        loginInput1: {
            backgroundColor: '#ffffff',
            borderColor: '#000000',
            borderWidth: 1.5,
            borderRadius: 5,
            // height: 45,
            // marginTop: '5%',
            marginRight: '10%',
            marginLeft: '10%',
            flexDirection: 'row'
        },
        loginInput2: {
            backgroundColor: '#ffffff',
            borderColor: '#000000',
            borderWidth: 1.5,
            borderRadius: 5,
            height: 45,
            // marginTop: '5%',
            marginRight: '10%',
            marginLeft: '10%',
            flexDirection: 'row'
        },
        loginInputForm1: {
            flex: 6,
            justifyContent: 'center',
            color: '#000'
        },
        loginInputForm2: {
            flex: 6,
            justifyContent: 'center',
            marginLeft: 20,
            color: '#000'
        },
        forgotPassword: {
            flexDirection:'row-reverse',
            marginLeft: '10%',
            marginTop: '5%'
        },
    signIn: {
        position: 'absolute',
        top: '53%',
        marginBottom: '40%',
        width: '100%',
        alignItems: 'center'
    },
    signInBtn: {
        backgroundColor: '#000000',
        width: '80%',
        height: '40%',
        borderRadius: 5,
        justifyContent: 'center'
    },
    signInText: {
        color: '#FAFC00',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
    },  
    bottom: {
        flex: 8,
        // justifyContent: 'center'
        
    },
        signUpText: {
            textAlign: 'center',
            fontSize: 15,
            fontWeight: 'bold',
            marginTop: '13%'
        }
});

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    logoImageContainer: {
        flex: 8,
        alignItems: 'center',
        // backgroundColor: '#FAFC00',
        // paddingTop: '20%'
        paddingTop: hp('10%')
    },
        logoImage: {
            width: 55, 
            height: 100,
            // marginTop: hp('1%')
            // marginTop: '12.5%'
        },
    logoTextContainer: {
        flex: 6,
        alignItems: 'center',
        // backgroundColor: '#FAFC00'
    },
        logoText: {
            height: 65,
            // marginTop: '10%'
            marginTop: hp('2%')
        },
    loginForm: {
        flex: 18,
        // backgroundColor: '#FAFC00'
    },
        leftIcon: {
            flex: 1,
            backgroundColor: '#000000',
            height: 42,
            width:42,
            justifyContent: 'center'
        },
        leftIconImage: {
            height: 20
        },  
        loginInput1: {
            backgroundColor: '#ffffff',
            borderColor: '#000000',
            borderWidth: 1.5,
            borderRadius: 5,
            height: 45,
            marginTop: hp('10%'),
            marginRight: wp('10%'),
            marginLeft: wp('10%'),
            // marginTop: '25%',
            // marginRight: '10%',
            // marginLeft: '10%',
            flexDirection: 'row'
        },
        loginInput2: {
            backgroundColor: '#ffffff',
            borderColor: '#000000',
            borderWidth: 1.5,
            borderRadius: 5,
            height: 45,
            marginTop: hp('3%'),
            marginRight: wp('10%'),
            marginLeft: wp('10%'),
            // marginTop: '5%',
            // marginRight: '10%',
            // marginLeft: '10%',
            flexDirection: 'row'
        },
        loginInputForm1: {
            flex: 6,
            justifyContent: 'center',
            marginLeft: 20,
            color: '#000'
        },
        loginInputForm2: {
            flex: 6,
            justifyContent: 'center',
            marginLeft: 20,
            color: '#000'
        },
        forgotPassword: {
            flexDirection:'row-reverse',
            marginLeft: '10%',
            // marginTop: '5%'
            marginTop: hp('2%')
        },
    signIn: {
        position: 'absolute',
        bottom: 0,
        // marginBottom: '40%',
        marginBottom: hp('25%'),
        width: '100%',
        alignItems: 'center'
    },
    signInBtn: {
        backgroundColor: '#000000',
        // width: '80%',
        // height: '40%',
        width: wp('80%'),
        height: hp('6%'),
        borderRadius: 5,
        justifyContent: 'center'
    },
    signInText: {
        color: '#FAFC00',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
    },  
    bottom: {
        flex: 8,
        justifyContent: 'center'        
    },
        signUpText: {
            textAlign: 'center',
            fontSize: 15,
            fontWeight: 'bold'
        }
});