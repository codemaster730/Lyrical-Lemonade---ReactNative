import React from 'react';
import {
    Platform,
    ScrollView,
    Text,
    View,
    Image,
    StyleSheet
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LOGIN_URL } from './constants/constants';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen'

const storage = new Storage({
    // maximum capacity, default 1000
    size: 1000,
   
    // Use AsyncStorage for RN apps, or window.localStorage for web apps.
    // If storageBackend is not set, data will be lost after reload.
    storageBackend: AsyncStorage, // for web: window.localStorage
   
    // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
    // can be null, which means never expire.
    defaultExpires: 1000 * 3600 * 24,
   
    // cache data in the memory. default is true.
    enableCache: true,
   
    // if data was not found in storage or expired data was found,
    // the corresponding sync method will be invoked returning
    // the latest data.
    sync: {
      // we'll talk about the details later.
    }
});

class Entry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: 'ddd',
            pwd: ''
        }
    }

    componentDidMount() {
        SplashScreen.hide();
        // setTimeout(this._gotoLogin, 2000);
        this._gotoLogin();
    }

    _gotoLogin = async () => {
        // storage.remove({
        //     key: 'loginState'
        // });
        let context = this;
        let flag = false;
        try {
        let value = await AsyncStorage.getItem('loginState');
        if (value != null){
            flag = true;
        }
        else {
            this.props.navigation.navigate("Login");
        }
        } catch (error) {
        // Error retrieving data
        }
        if(flag == true) {
            storage.load({
                key: 'loginState',
                autoSync: true,
                syncInBackground: true,
                syncParams: {
                extraFetchOptions: {
                    // blahblah
                },
                someFlag: true
                }
            })
            .then(ret => {
                this.setState({'email' : ret.email});
                this.setState({'password' : ret.password});
    
                var body = {
                    "email" : ret.email,
                    "password" : ret.password
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
                        this.props.navigation.navigate('Home');
                    }else{
                        this.props.navigation.navigate('Login');
                    }
                });
            })
            .catch(err => {
                
            });
        }
        
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logoImage}
                        source={require('../images/logo.png')}
                    />
                </View>
            </View>
        );
    }
}

export default Entry;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFC00',
        justifyContent: 'center'
    },
    logoContainer: {
        alignItems: 'center'
    },  
    logoImage: {
        width: 60, 
        height: 105,
        // marginTop: '75%'
    }
});