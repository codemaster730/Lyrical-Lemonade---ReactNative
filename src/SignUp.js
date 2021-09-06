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
    KeyboardAvoidingView,
    StatusBar
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native-gesture-handler';
import InputComponent from './components/InputComponent';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
  } from 'react-native-responsive-screen';
import Spinner from 'react-native-loading-spinner-overlay';
import base64 from 'react-native-base64';

import { SIGNUP_URL, LOGIN_URL } from './constants/constants';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';

const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    sync: {
      
    }
});

class SignUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isKeyboard: 0,
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            signupSuccess: 0,
            tmp: '',
            spinnerState: false,
            error: 'no error'
        }
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          this._keyboardDidShow.bind(this),
        );
        this.keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
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
            <View style={styles.logoTextContainer}>
                <Image
                    resizeMode={"contain"}
                    style={styles.logoText}
                    source={require('../images/logoText.png')}
                /> 
            </View>
        );
    }

    _inputFirstName(param) {
        this.setState({firstName: param});
    }

    _inputLastName(param) {
        this.setState({lastName: param});
    }

    _inputEmail(param) {
        this.setState({email: param});
    }

    _inputPassword(param) {
        this.setState({password: param});
    }

    showAlert() {
        setTimeout(() => {
        Alert.alert(
            'Your email address is duplicated.'
            )
        }, 100);
    }

    showAlert11() {
        setTimeout(() => {
        Alert.alert(
            'You have to type all input fields.'
            )
        }, 100);
    }

    async _signup() {
        var body = {
            "first_name" : this.state.firstName,
            "last_name" : this.state.lastName,
            "email" : this.state.email,
            "password" : this.state.password
        }

        const email = this.state.email;
        const password = this.state.password;
        const first = this.state.firstName;
        const last = this.state.lastName;

        if(email == "" || password == "" || first == "" || last == "") {
            this.showAlert11();
            return;
        }

        var body1 = {
            "customer": {
                "first_name": this.state.firstName,
                "last_name": this.state.lastName,
                "email": this.state.email,
                "phone": "",
                "verified_email": false,
                "addresses": [
                    {
                        "address1": "",
                        "city": "",
                        "province": "",
                        "phone": "",
                        "zip": "",
                        "last_name": "",
                        "first_name": "",
                        "country": ""
                    }
                ]
            }
        }

        var param = JSON.stringify(body1);

        this.setState({spinnerState: true});

        var headers = new Headers();
        headers.append('Authorization', 'Basic ' + base64.encode('8c1ecb52c850c9e05c2eeca3c2bffdba' + ':' + '793cb4efe34466cca7cf9e15bfbf3c6a'));
        headers.append('Content-Type', 'application/json');

        const response = await fetch("https://shop-lyrical-lemonade.myshopify.com/admin/api/2020-01/customers.json", {method: 'POST', headers: headers, body: param});
        const json = await response.json();

        storage.save({
            key: 'customer', // Note: Do not use underscore("_") in key!
            data: {
                customer: json
            },
            expires: null
        });

        fetch(SIGNUP_URL, {
            method: "post",
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify(body),
        }).then(res => res.json()).then(resJson => {
            this.setState({error: JSON.stringify(resJson)});
            this.setState({spinnerState: false});
            if(resJson.success) {

                fetch(LOGIN_URL, {
                    method: "post",
                    headers: {
                        "Content-type" : "application/json"
                    },
                    body: JSON.stringify({ "email" : email,
                    "password" : password}),
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
            }else{
                this.setState({"signupSuccess": -1});
            }

            if(resJson.success) {
                
            }else{
                this.showAlert();
            }
        }).catch(error => {
            this.setState({"error": error});
        });
    }


    render() {
        const isKeyboard = this.state.isKeyboard;
        const firstName = this.state.firstName;
        const lastName = this.state.lastName;
        const email = this.state.email;
        const password = this.state.password;
        const signupSuccess = this.state.signupSuccess;

        if(isKeyboard == 0 || isKeyboard == -1) {
            // var aniFlex = 1;
        }
        if(isKeyboard == 1) {
            // var aniFlex = 16;
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
            
        };

        return (
            <TouchableWithoutFeedback style={{flex: 1}} onPress={() => {Keyboard.dismiss(); this._keyboardDidHide()}} accessible={false}>
            <View style={styles.container}>
            <StatusBar  barStyle="dark-content" translucent={true} />
            <Spinner visible={this.state.spinnerState } />
            <Animatable.View 
                animation={isKeyboard == 1 ? slideUp : isKeyboard == -1 ? slideDown : ''} 
                duration={300} ref={this.handleViewRef}>
            
                <View style={styles.logoImageContainer }>
                    <Image
                        resizeMode={"contain"}
                        style={[styles.logoImage, {zIndex: 10}]}
                        source={require('../images/logo.png') }
                    /> 
                </View>
                {this._logoText()}
                

                <View style={styles.signupForm}>
                    <View style={styles.multiInput}>
                        {/* <InputComponent width="100%" label="First Name" secure={false} place="First Name" flexNum={1} mTop={"2%" } inputFunc={(param) => this._inputFirstName(param)} initValue={firstName} ></InputComponent> */}
                    <View style={[styles.container1, {flex: 1, marginTop: hp("2%"), marginLeft: this.props.mLeft}]}>
                        <View style={styles.labelContainer}>
                            <Text  style={styles.label}>First Name</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput style={[styles.input, {width: this.props.width}]} placeholder="First Name" placeholderTextColor="#777" secureTextEntry={false}  onChangeText={ text => {
                                this._inputFirstName(text);
                            }} value={firstName} onFocus={() => this._keyboardDidShow()}/>
                        </View>
                    </View>
                        {/* <InputComponent width="100%" label="Last Name" secure={false} place="Last Name" flexNum={1} mLeft="10%" mTop={"2%" } inputFunc={(param) => this._inputLastName(param)} initValue={lastName}></InputComponent> */}
                    <View style={[styles.container1, {flex: 1, marginTop: hp("2%"), marginLeft: "10%"}]}>
                        <View style={styles.labelContainer}>
                            <Text  style={styles.label}>Last Name</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput style={[styles.input, {width: "100%"}]} placeholder="Last Name" placeholderTextColor="#777" secureTextEntry={false}  onChangeText={ text => {
                                this._inputLastName(text);
                            }} value={lastName} onFocus={() => this._keyboardDidShow()} />
                        </View>
                    </View>
                    </View>
                    {/* <InputComponent width="100%" label="Email" secure={false} place="Email address" mTop="2%" inputFunc={(param) => this._inputEmail(param)} initValue={email}> </InputComponent> */}
                    <View style={[styles.container1, { marginTop: hp("2%")}]}>
                        <View style={styles.labelContainer}>
                            <Text  style={styles.label}>Email</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput style={[styles.input, {width: "100%"}]} placeholder="Email address" placeholderTextColor="#777" secureTextEntry={false}  onChangeText={ text => {
                                this._inputEmail(text);
                            }} value={email} onFocus={() => this._keyboardDidShow()} />
                        </View>
                    </View>
                    {/* <InputComponent width="100%" label="Password" secure={true} place="Password" mTop="2%" inputFunc={(param) => this._inputPassword(param)} initValue={password}></InputComponent> */}
                    <View style={[styles.container1, { marginTop: hp("2%")}]}>
                        <View style={styles.labelContainer}>
                            <Text  style={styles.label}>Password</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput style={[styles.input, {width: "100%"}]} placeholder="Password" placeholderTextColor="#777" secureTextEntry={true}  onChangeText={ text => {
                                this._inputPassword(text);
                            }} value={password} onFocus={() => this._keyboardDidShow()} />
                        </View>
                    </View>
                    
                    <View style={styles.signIn }>
                        <TouchableOpacity style={styles.signInTouch} onPress={() => {
                            this._signup();
                        }}>
                            <View style={styles.signInBtn}>
                                <Text style={styles.signInText}>GET STARTED</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                
                    <View style={styles.bottom }>
                        <TouchableOpacity style={styles.logoContainer} onPress={() => {this.props.navigation.navigate("Login")}}>
                            <Text style={styles.signUpText}>SIGN IN</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                </Animatable.View>
            </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default SignUp;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container1: {
        flexDirection: 'column'
    },
    labelContainer: {
        
    },
        label: {
            
        },
    inputContainer: {
        marginTop: 5
    },
        input: {
            backgroundColor: '#ffffff',
            borderColor: '#000000',
            borderWidth: 1.5,
            borderRadius: 5,
            height: 45,
            paddingLeft: 10,
            color: '#000'
        },
    logoImageContainer: {
        
        alignItems: 'center',
        backgroundColor: '#fff',
        zIndex: 10,
        // paddingTop: '20%'
        marginTop: '20%'
    },
        logoImage: {
            width: 55, 
            height: 100,
            // marginTop: '12.5%'
            marginTop: hp('1.5%')
        },
    logoTextContainer: {
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: '10%'
    },
        logoText: {
            height: 65,
            // marginTop: '10%'
            // marginTop: hp('3%')
        },
    signupForm: {
        marginTop: '10%',
        // backgroundColor: '#FAFC00',
        zIndex: 1,
        paddingRight: '10%',
        paddingLeft: '10%',
    },
        multiInput: {
            flexDirection: 'row'
        },
    signIn: {
        marginTop: '12%',
        width: '100%',
        alignItems: 'center',
    },
    signInTouch: {
        // paddingLeft: '4%',
        // paddingRight: '4%'
    },
    signInBtn: {
        // paddingLeft: '30%',
        // paddingRight: '30%',
        backgroundColor: '#000000',
        borderRadius: 5,
        justifyContent: 'center',
        height: 45,
    },
    signInText: {
        color: '#FAFC00',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: '35%',
        marginRight: '35%',
        width: '35%'
    },  
    bottom: {
        marginTop: '10%',
        justifyContent: 'center'   
    },
        signUpText: {
            textAlign: 'center',
            fontSize: 15,
            fontWeight: 'bold'
        }
});