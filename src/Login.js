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

import { LOGIN_URL } from './constants/constants';

import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { initialMode } from 'react-native-dark-mode';
import * as Animatable from 'react-native-animatable';

 
const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage, 
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {
    // we'll talk about the details later.
  }
});
  

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isKeyboard: 0,
            email: '',
            password: '',
            invalidEmail: false,
            emptyInput: false,
            loginSuccess: 0,
            error: 'no error',
            parmas: '',
            spinnerState: false,
            loginEmail: false
        }
    }

    // **************************
   
    // **************************

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
            isKeyboard: 1
        }));
    }

    _keyboardDidHide() {
        this.setState(prevS => ({
            isKeyboard: -1
        }));
    }

    _logoText() {
        return (
            <View style={[styles.logoTextContainer]}>
                <Image
                    resizeMode={"contain"}
                    style={styles.logoText}
                    source={require('../images/logoText.png')}
                /> 
            </View>
        );
    }

    showAlert(){
        setTimeout(() => {
            Alert.alert(
                'Email or password is wrong.'
             )
            }, 100);
        
    }

    _login() {
        this.setState({spinnerState: true});
        var body = {
            "email" : this.state.email,
            "password" : this.state.password
        }
        
        fetch(LOGIN_URL, {
            method: "post",
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify(body),
        })
        .then(res => res.json())
        .then(resJson => {
            if(resJson.success) {
                this.setState({spinnerState: false});
                this.setState({"loginSuccess": 1});
            }else{
                this.setState({spinnerState: false});
                // this.setState({"loginSuccess": -1});
            }

            if(resJson.success) {
                storage.save({
                    key: 'loginState', // Note: Do not use underscore("_") in key!
                    data: {
                        loginSuccess: true,
                        id: resJson.detail.id,
                        email: resJson.detail.email,
                        password: this.state.password,
                        token: resJson.token,
                        first_name: resJson.detail.first_name,
                        last_name: resJson.detail.last_name,
                        image: resJson.detail.image
                    },
                    expires: null
                });
                
                this.props.navigation.navigate('Home');
            }else{
                this.showAlert();
                console.log("login failed.")
            }
        }).catch(error => {
            this.setState({"error": error});
        });
    }

    _validEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    render() {
        const isKeyboard = this.state.isKeyboard;
        const emailInput = this.state.email;
        const pwdInput = this.state.password;
        const invalidEmail = this.state.invalidEmail;
        const emptyInput = this.state.emailInput;
        const error = this.state.error;
        const loginSuccess = this.state.loginSuccess;
        const loginEmail = this.state.loginEmail;

        
        if(isKeyboard == 0 || isKeyboard == -1) {
            var aniFlex = 10;
        }
        if(isKeyboard == 1) {
            var aniFlex = 6;
        }

        const slideUp = {
            0: {
                translateY: 0,
              },
              0.5: {
                translateY: -100,
              },
              1: {
                translateY: -200,
              },
              2: {
                translateY: -300,
                }
        };

        // const slideDown = {
        //     0: {
        //         translateY: -300,
        //     },
        //     0.5: {
        //         translateY: -200,
        //     },
        //     1: {
        //         translateY: -100,
        //       },
        //     2: {
        //         translateY: 0,
        //     }
        // };

        const slideDown = {
            0: {
                translateY: 0,
            },
            0.5: {
                translateY: 0,
            },
            1: {
                translateY: 0,
              },
            2: {
                translateY: 0,
            }
        };

        return (
            <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
            <StatusBar  barStyle="dark-content" translucent={true} />
                <View style={styles.logoImageContainer }>
                    <Image
                        resizeMode={"contain"}
                        style={styles.logoImage}
                        source={require('../images/logo.png')}
                    /> 
                </View>
                {this._logoText()}
                <Spinner
                    visible={this.state.spinnerState}
                    textStyle={styles.spinnerTextStyle}
                />
                <Animatable.View 
                animation={isKeyboard == 1 ? slideUp : isKeyboard == -1 ? slideDown : ''} 
                duration={300} style={{backgroundColor: '#fff', flex: 10, zIndex: 1}}
                        ref={this.handleViewRef}>
                    <View style={styles.loginForm}>
                        <View style={styles.loginInput1}>
                            <View style={styles.leftIcon}>
                                <Image
                                    resizeMode={"contain"}
                                    style={styles.leftIconImage}
                                    source={require('../images/email_prefix.png')}
                                />
                            </View>
                            <TextInput style={styles.loginInputForm1} placeholder="Email address" placeholderTextColor="#777" onChangeText={ text => {
                                    this.setState({"email" : text});
                                }} value={emailInput} />
                        </View>
                        <View style={styles.loginInput2}>
                            <View style={styles.leftIcon}>
                                <Image
                                    resizeMode={"contain"}
                                    style={styles.leftIconImage}
                                    source={require('../images/lock.png')}
                                />
                            </View>
                            <TextInput style={styles.loginInputForm2} placeholder="Password" placeholderTextColor="#777" secureTextEntry={true} onChangeText={ text => {
                                this.setState({"password" : text});
                            }} value={pwdInput} />
                            
                        </View>
                        
                        <View style={styles.forgotPassword}>
                            <TouchableOpacity style={styles.logoContainer} onPress={() => {this.props.navigation.navigate("Forgot")}}>
                                <Text >Forgot Password</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={styles.signIn}>
                        <TouchableOpacity style={styles.signInBtn} onPress={() => {
                            if(!this._validEmail(emailInput)) {
                                this.setState({"invalidEmail" : true});
                                return ;
                            }else{
                                this.setState({"invalidEmail" : false});
                            }

                            if(emailInput == '' || pwdInput == '') {
                                this.setState({"emptyInput" : true});
                                return ;
                            }
                            this._login();
                        }}>
                            <Text style={styles.signInText}>SIGN IN</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bottom }>
                        <TouchableOpacity style={styles.logoContainer} onPress={() => {this.props.navigation.navigate("SignUp")}}>
                            <Text style={styles.signUpText}>SIGN UP</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default Login;

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
        paddingTop: '21.6%',
    },
        logoImage: {
            width: 55, 
            height: 100
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
        flex: 1,
        backgroundColor: '#fff'
    },
    logoImageContainer: {
        zIndex: 10,
        flex: 2,
        alignItems: 'center',
        // backgroundColor: '#ddd',
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
        flex: 2,
        alignItems: 'center',
        // backgroundColor: '#FAFC00'
    },
        logoText: {
            height: 65,
            // marginTop: '10%'
            marginTop: hp('2%')
        },
    loginForm: {
        marginTop: hp('5%')
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
        
        marginTop: hp('5%'),
        // marginBottom: '40%',
        // marginBottom: hp('15%'),
        width: '100%',
        alignItems: 'center'
    },
    signInBtn: {
        backgroundColor: '#000000',
        
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
        marginTop: hp('3%'),
        justifyContent: 'center'        
    },
        signUpText: {
            textAlign: 'center',
            fontSize: 15,
            fontWeight: 'bold'
        }
});