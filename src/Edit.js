import React, { useState, useEffect } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  Button,
  Alert
} from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback, TextInput } from 'react-native-gesture-handler';
import { SimpleAnimation } from 'react-native-simple-animations';
import SidebarComponent from './components/SidebarComponent';
import CarouselComponent from './components/CarouselComponent';
import ItemComponent from './components/ItemComponent';
import { StackView } from 'react-navigation-stack';
import SmallItemComponent from './components/SmallItemComponent';
import InputComponent from './components/InputComponent';
import ButtonComponent from './components/ButtonComponent';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import {UPDATE_PROFILE_URL} from './constants/constants';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';
import ImageOverlay from 'react-native-image-overlay';
import Dialog, { DialogFooter, DialogButton, DialogContent} from 'react-native-popup-dialog';
import { PROFILE_IMAGE_UPLOAD_URL, LOGIN_URL, PUBLIC_FOLDER, DELETE_PROFILE_IMAGE } from './constants/constants';
import base64 from 'react-native-base64';
// require the module
var RNFS = require('react-native-fs');
 
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

// You can then use your `FadeInView` in place of a `View` in your components:
class Edit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      updateProfileSuccess: 0,
      error: 'no error',
      spinnerState: false,
      photo: null,
      image: '',
      storageTmp: '',
      isSidebar: false,
      shippingModal: false,
      street: '',
      country: '',
      province: '',
      city: '',
      paymentModal: false,

      cardNumber: '',
      name:'',
      exDate: '',
      securityCode: ''
    }
  }

  _setShippingModalShow() {
    this.setState({shippingModal: true});
  }

  _setShippingModalHide = () => this.setState({shippingModal: false});

  _animationView() {
    return (
      <SimpleAnimation delay={0} duration={1000} direction="right" style={{flex: 4}}>
        <SidebarComponent navigation={this.props.navigation}  pageName="Profile" hideAgain={() => this._hideSidebar()}></SidebarComponent>
      </SimpleAnimation>
    );
  }

  showAlert() {
    setTimeout(() => {
      Alert.alert(
          'Please wait while uploading image.'
       )
      }, 100);
  }

  showSpinner() {
    
  }

  _showSidebar() {
    this.setState(prev => ({
      isSidebar: true
    }));
  }

  _hideSidebar() {
    this.setState(prev => ({
      isSidebar: false
    }));
  }

  handleChoosePhoto = () => {
    const options = {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ photo: response });
        this.uploadProfileImage();
      }
    });
  }

  uploadProfileImage = () => {
    this.showAlert();
    this.setState({spinnerState: true});
    // create an array of objects of the files you want to upload
    var img  = this.state.photo

    console.log("img url => ", img.uri)

    var files = [
      {
        filename: 'file.jpg',
        filepath: Platform.OS === "android" ? img.uri : img.uri.replace("file://", ""),
        name: 'img',
        type: 'image/jpeg',
      }
    ];

    var uploadBegin = (response) => {
      var jobId = response.jobId;
      console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
    };

    var uploadProgress = (response) => {
      var percentage = Math.floor((response.totalBytesSent/response.totalBytesExpectedToSend) * 100);
      console.log('UPLOAD IS ' + percentage + '% DONE!');
    };

    // upload files
    storage.load({
        key: 'loginState',
        autoSync: true,
        syncInBackground: true,
        syncParams: {
        extraFetchOptions: {
            
        },
        someFlag: true
        }
    })
    .then(ret => {
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
            RNFS.uploadFiles({
              toUrl: PROFILE_IMAGE_UPLOAD_URL,
              files: files,
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'x-access-token' : resJson.token
              },
              fields: {
                id: this.state.id,
                'hello': 'world',
              },
              begin: uploadBegin,
              progress: uploadProgress
            }).promise.then((response) => {
              this.setState({error: JSON.stringify(response)})
                if (response.statusCode == 200) {
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
                      // this.setState({error: JSON.stringify(resJson)});
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
                        
                        // if expires not specified, the defaultExpires will be applied instead.
                        // if set to null, then it will never expire.
                        expires: null
                      });

                      this.setState({photo: {uri: PUBLIC_FOLDER + resJson.detail.image}});
                      this.setState({spinnerState: false});
                    }else{
                      console.log("login failed.");
                      this.setState({error: JSON.stringify(resJson)});
                      // this.setState({spinnerState: false});
                    }
                  }).catch(err => {
                    // this.setState({spinnerState: false});
                  });
                  console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
                } else {
                  console.log('SERVER ERROR');
                }
            })
            .catch((err) => {
              if(err.description === "cancelled") {
                // cancelled by user
              }
              console.log(err);
            });
          }else{
              
          }
      });
    });
    
  }

  componentDidMount() {
    this.setState({spinnerState: true});
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
        this.setState({storageTmp: ret});
        this.setState({"firstName": ret.first_name});
        this.setState({"lastName": ret.last_name});
        this.setState({"email": ret.email});
        this.setState({"id": ret.id});
        this.setState({"password": ret.password});
        this.setState({"token": ret.token});
        this.setState({"image": ret.image});
        this.setState({photo: {uri: PUBLIC_FOLDER + ret.image}});
    });
    this.setState({spinnerState: false});
    
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

  _deleteProfileImage() {
    this.setState({spinnerState: true});
    storage.load({
        key: 'loginState',
        autoSync: true,
        syncInBackground: true,
        syncParams: {
        extraFetchOptions: {},
        someFlag: true
        }
    })
    .then(ret => {
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
            var body = {
              id: resJson.detail.id,
            }
            fetch(DELETE_PROFILE_IMAGE, {
                method: "post",
                headers: {
                    "Content-type" : "application/json",
                    "x-access-token" : resJson.token
                },
                body: JSON.stringify(body),
            }).then(res => res.json()).then(resJson1 => {
                if(resJson1.success) {
                  this.setState({updateProfileSuccess: 1});
                  this.setState({photo: {uri: "noimage"}});
                  this.setState({spinnerState: false});
                  storage.save({
                      key: 'loginState', // Note: Do not use underscore("_") in key!
                      data: {
                        loginSuccess: true,
                        id: resJson1.data.id,
                        email: resJson1.data.email,
                        password: ret.password,
                        token: resJson.token,
                        first_name: resJson1.data.first_name,
                        last_name: resJson1.data.last_name,
                        image: resJson1.data.image,
                      },
                      // if expires not specified, the defaultExpires will be applied instead.
                      // if set to null, then it will never expire.
                      expires: null
                  });
                }else{
                  this.setState({"error": JSON.stringify(resJson)});  
                  this.setState({updateProfileSuccess: -1});
                }
            }).catch(error => {
                this.setState({"error": JSON.stringify(error)});
            });

          }else{
              
          }
      });
    });
  }

  _updateProfile() {
    this.setState({spinnerState: true});
    storage.load({
        key: 'loginState',
        autoSync: true,
        syncInBackground: true,
        syncParams: {
        extraFetchOptions: {},
        someFlag: true
        }
    })
    .then(ret => {
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
            var body = {
              id: resJson.detail.id,
              first_name: this.state.firstName,
              last_name: this.state.lastName,
              email: this.state.email
            }
            fetch(UPDATE_PROFILE_URL, {
                method: "post",
                headers: {
                    "Content-type" : "application/json",
                    "x-access-token" : resJson.token
                },
                body: JSON.stringify(body),
            }).then(res => res.json()).then(resJson1 => {
                if(resJson1.success) {
                  this.setState({updateProfileSuccess: 1});
                  this.setState({spinnerState: false});
                  storage.save({
                      key: 'loginState', // Note: Do not use underscore("_") in key!
                      data: {
                        loginSuccess: true,
                        id: resJson1.data.id,
                        email: resJson1.data.email,
                        password: ret.password,
                        token: resJson.token,
                        first_name: resJson1.data.first_name,
                        last_name: resJson1.data.last_name,
                        image: resJson1.data.image,
                      },
                      // if expires not specified, the defaultExpires will be applied instead.
                      // if set to null, then it will never expire.
                      expires: null
                  });
                }else{
                  // this.setState({"error": JSON.stringify(resJson)});  
                  this.setState({updateProfileSuccess: -1});
                }
            }).catch(error => {
                this.setState({"error": JSON.stringify(error)});
            });

          }else{
              
          }
      });
    });    
    
  }

  _inputStreet(param) {
    this.setState({street: param});
  }

  _inputCountry(param) {
    this.setState({country: param});
  }

  _inputState(param) {
    this.setState({province: param});
  }

  _inputCity(param) {
    this.setState({city: param});
  }

  async _updateAddress() {
    storage.load({
        key: 'customer',
        autoSync: true,
        syncInBackground: true,
        syncParams: {
        extraFetchOptions: {
            
        },
        someFlag: true
        }
    })
    .then( async ret => {
      var customerTmp = ret.customer.customer;
      var id = customerTmp.id;
      var lName = customerTmp.last_name;
      var fName = customerTmp.first_name;

      const street = this.state.street;
      const country = this.state.country;
      const province = this.state.province;
      const city = this.state.city;

      const first_name = this.state.firstName;
      const last_name = this.state.lastName;
      const email = this.state.email;

      var param = JSON.stringify({
        "customer": {
          "id": id,
          "first_name" : first_name,
          "last_name" : last_name,
          "email" :email,
          "addresses": [
            {
              "address1": street,
              "city": city,
              "province": province,
              "phone": "",
              "zip": "",
              "last_name": last_name,
              "first_name": first_name,
              "country": country
            }
          ]
        }
      });
      var headers = new Headers();
      headers.append('Authorization', 'Basic ' + base64.encode('8c1ecb52c850c9e05c2eeca3c2bffdba' + ':' + '793cb4efe34466cca7cf9e15bfbf3c6a'));
      headers.append('Content-Type', 'application/json');
  
      const response = await fetch("https://shop-lyrical-lemonade.myshopify.com/admin/api/2020-01/customers/" + id + ".json", {method: 'PUT', headers: headers, body: param});
      const json = await response.json();
      this.setState({street:street});
      this.setState({city:city});
      this.setState({province:province});
      this.setState({country:country});
      if(json.error != undefined) {
        
      }else{
        storage.save({
          key: 'customer', // Note: Do not use underscore("_") in key!
          data: {
            customer: json
          },
          expires: null
        });
      }
    });
  }

  _setPaymentModalHide() {
    this.setState({paymentModal: false});
  }

  _setPaymentModalShow() {
    this.setState({paymentModal: true});
  }

  _inputSecurityCode(param) {
    this.setState({securityCode: param});
  }

  _inputExDate(param) {
    this.setState({exDate: param});
  }

  _inputCardNum(param) {
    this.setState({cardNumber: param});
  }

  _inputName(param) {
    this.setState({name: param});
  }

  async _creditCard() {
    this.setState({paymentModal: false});

    var name = this.state.name;
    var cardNumber = this.state.cardNumber;
    var exDate = this.state.exDate;
    var securityCode = this.state.securityCode;

    name = name.split(" ");
    var fName = name[0];
    var lName = name[1];
    exDate = exDate.split('/');
    var month = exDate[0];
    var year = exDate[1];

    var param = JSON.stringify({
      "credit_card": {
        "number": cardNumber,
        "first_name": fName,
        "last_name": lName,
        "month": month,
        "year": year,
        "verification_value": securityCode
      }
    });

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const response = await fetch("https://elb.deposit.shopifycs.com/sessions", {method: 'POST', headers: headers, body: param});
    const json = await response.json();

    this.setState({spinnerState: false});

    storage.save({
      key: 'credit', // Note: Do not use underscore("_") in key!
      data: {
        session_id: json,
        cardNumber: cardNumber,
        exDate: exDate,
        name: name,
        securityCode: securityCode
      },
      expires: null
    });
  }

  _logout() {
    storage.remove({
      key: 'loginState'
    });
    this.props.navigation.navigate('Login');
  }

  render(){
    const isSidebar = this.state.isSidebar;

    const additionalStyle = isSidebar ? StyleSheet.create({
      sidebarStyle: {
        // opacity: 0.3
      }
    }) : StyleSheet.create({
      sidebarStyle: {
        opacity: 1
      }
    });

    const firstName = this.state.firstName;
    const lastName = this.state.lastName;
    const email = this.state.email;
    const updateProfileSuccess = this.state.updateProfileSuccess;
    const { photo, error } = this.state;

    const street = this.state.street;
    const country = this.state.country;
    const province = this.state.province;
    const city = this.state.city;

    const cardNumber = this.state.cardNumber;
    const exDate = this.state.exDate;
    const name = this.state.name;
    const securityCode = this.state.securityCode;

    if(cardNumber != '') {
      var card = cardNumber.split(" ");
      var len = card.length;
      card = card[len - 1];
    }else{
      var card = '';
    }

    return (
      <View style={styles.container}>
        {isSidebar ? this._animationView() : null}
        <Spinner
            visible={this.state.spinnerState}
        />
        <View style={[styles.contentContainer, additionalStyle.sidebarStyle]}>
          <View style={styles.content}>
            <Dialog  visible={this.state.shippingModal}
                  onTouchOutside={() => {
                    this._setShippingModalHide();
                  }}
            >
              <DialogContent style={styles.modalContainer}>
              <ScrollView>
                <View style={styles.shipModalHeader}>
                  <TouchableOpacity  onPress={() => {
                      this._setShippingModalHide();
                    }} >
                    <Image style={styles.cancelImage} resizeMode="contain" source={require("../images/cancelIcon.png")}/>
                  </TouchableOpacity>
                  <Image style={styles.shippingImage2} resizeMode="contain" source={require("../images/shipping2.png")}/>
                </View>
                <View style={styles.shipModalBody}>
                  <View style={{height: '5%'}}></View>
                  <InputComponent label="Street" place="143 Lemon Drop Ave" mTop="0%" inputFunc={(param) => this._inputStreet(param)} initValue={street}></InputComponent>
                  <View style={{height: '5%'}}></View>
                  <InputComponent label="Country" place="United States" mTop="0%" inputFunc={(param) => this._inputCountry(param)} initValue={country}></InputComponent>
                  <View style={{height: '5%'}}></View>
                  <InputComponent label="State" place="California" mTop="0%" inputFunc={(param) => this._inputState(param)} initValue={province}></InputComponent>
                  <View style={{height: '5%'}}></View>
                  <InputComponent label="City" place="Los Angeles" mTop="0%" inputFunc={(param) => this._inputCity(param)} initValue={city}></InputComponent>
                  <View style={{height: '15%'}}></View>
                </View>
                <View style={styles.shipModalBottom}>
                  <TouchableOpacity onPress={() => {this._setShippingModalHide()}}>
                    <Image resizeMode="contain" source={require('../images/save.png')} style={styles.saveImage} />
                  </TouchableOpacity>
                </View>
                </ScrollView>
              </DialogContent>  
            </Dialog>

            <Dialog  visible={this.state.paymentModal}
                  onTouchOutside={() => {
                    this._setPaymentModalHide();
                  }}
            >
              <DialogContent style={styles.modalContainer1}>
                <View style={styles.paymentModalHeader}>
                  <TouchableOpacity  onPress={() => {
                      this._setPaymentModalHide();
                    }} >
                    <Image style={styles.cancelImage} resizeMode="contain" source={require("../images/cancelIcon.png")}/>
                  </TouchableOpacity>
                  <Image style={styles.paymentImage1} resizeMode="contain" source={require("../images/paymentBtn.png")}/>
                </View>
                <View style={styles.paymentDetail}>
                    <View style={styles.detailImages}>
                      <Image style={styles.detailImage1} resizeMode="contain" source={require('../images/payment.png')} />
                      <Image style={styles.detailImage2} resizeMode="contain" source={require('../images/logo.png')} />
                    </View>
                    <View style={styles.paymentNumber}>
                      <Text style={styles.dots1}>.... .... ....</Text>
                      <Text style={styles.number1}>3127</Text>
                    </View>
                    <View style={styles.paymentDate}>
                      <Text style={styles.customer}>Tommy Bahama</Text>
                      <Text style={styles.date}>02 / 22</Text>
                    </View>
                </View>
                <View style={styles.paymentForm}>
                    <View style={{height: '7%'}}></View>
                    <InputComponent label="Card Number" mTop="0%" place="7283 2839 4739 3127" inputFunc={(param) => this._inputCardNum(param)} initValue={cardNumber}></InputComponent>
                    <View style={{height: '7%'}}></View>
                    <InputComponent label="Name on card" mTop="0%" place="John Smith" inputFunc={(param) => this._inputName(param)} initValue={name}></InputComponent>
                    <View style={{height: '5%'}}></View>
                    <View style={styles.multiInput}>
                      <InputComponent width="100%" label="Experation Date" place="02/22" secure={false}  flexNum={1} mTop="2%" inputFunc={(param) => this._inputExDate(param)} initValue={exDate}></InputComponent>
                      <InputComponent width="100%" label="Security Code" secure={false}  flexNum={1} mLeft="10%" mTop="2%" place="123" inputFunc={(param) => this._inputSecurityCode(param)} initValue={securityCode}></InputComponent>
                  </View>
                </View>
                <View style={styles.paymentModalBottom}>
                  <TouchableOpacity onPress={() => {this._setPaymentModalHide()}}>
                    <Image resizeMode="contain" source={require('../images/save.png')} style={styles.saveImage1} />
                  </TouchableOpacity>
                </View>
              </DialogContent>
            </Dialog>

            <View style={styles.headerContainer}>
              {/* <View style={styles.sidebarMenu}>
                <TouchableOpacity onPress={() => {this.props.navigation.navigate('Profile', {
                  profileImg: photo.uri,
                  firstName: firstName,
                  lastName: lastName
                })}}>
                  <Image resizeMode="contain" style={styles.sidebarMenuImage} source={require('../images/arrow.png')} />
                </TouchableOpacity>
              </View> */}
              <View style={styles.sidebarMenu}>
                <TouchableOpacity onPress={() => {this._showSidebar()}}>
                  <Image resizeMode="contain" style={styles.sidebarMenuImage} source={require('../images/navIcon.png')} />
                </TouchableOpacity>
              </View>

              <View style={styles.homeLogo}>
                {/* <Text style={styles.homeLogoText}>EDIT PROFILE</Text> */}
                <Text style={styles.homeLogoText}>PROFILE</Text>
              </View>
            </View>

            <View style={styles.bodyContainer}>
              <ScrollView>              
                <View style={styles.profileContainer}>
                  
                </View>

                <View style={styles.btnGroup}>
                  <View style={styles.fBtnContainer}>
                    <TouchableOpacity onPress={() => this._deleteProfileImage()}>
                      <View style={styles.favoritesBtn}>
                          <Text style={styles.favoritesText}>DELETE</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                    <View style={styles.logo}>
                    <TouchableWithoutFeedback  style={styles.profileImageTouch}>
                        <View style={styles.profileImageContainer}>
                          {photo && (
                            <Image
                              style={styles.profileImage}
                              source={{ uri: photo.uri }}
                            />
                          )}
                        </View>                        
                      </TouchableWithoutFeedback>
                      <View style={styles.profileLogoContainer}>
                        <Image resizeMode="contain" style={styles.profileLogo} source={images.logoImage} />
                      </View>
                    </View>
                  <View style={styles.oBtnContainer}>
                    <TouchableOpacity  onPress={() => this.handleChoosePhoto()}>
                      <View style={styles.orderBtn}>
                          <Text style={styles.orderText}>CHANGE</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.formContainer}>
                  <View style={styles.multiInput}>
                      <InputComponent width="100%" label="First Name" secure={false} place="Danny" flexNum={1} mTop="12%" inputFunc={(param) => this._inputFirstName(param)} initValue={firstName}></InputComponent>
                      <InputComponent width="100%" label="Last Name" secure={false} place="Phantom" flexNum={1} mLeft="10%" mTop="12%" inputFunc={(param) => this._inputLastName(param)} initValue={lastName}></InputComponent>
                  </View>
                  <View style={{marginTop: '10%'}}></View>
                  <InputComponent width="100%" label="Email" secure={false} place="danny.phantom@jmail.com" mTop="1%" inputFunc={(param) => this._inputEmail(param)} initValue={email}></InputComponent>
                </View>
                <View style={[styles.saveBtn, {marginTop: '10%'}]}>
                  <TouchableOpacity onPress={() => this._updateProfile()}>
                    <Image  style={!isSidebar ? styles.saveBtnImage : {width: wp('80%')}} resizeMode="contain" source={require('../images/save1.png')} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.saveBtn, {marginTop: '5%', width: '100%'}]}>
                  <TouchableOpacity onPress={() => this._logout()}>
                    <View style={{width: '100%', backgroundColor: '#000', borderRadius: 7}}>
                      <Text style={{color: "#fafc00", textAlign: 'center', paddingRight: '38%', paddingLeft: '38%', paddingTop: '4.4%', paddingBottom: '4.4%', fontSize: 16, fontWeight: 'bold'}}>LOGOUT</Text>
                    </View>
                  </TouchableOpacity>
                </View>
               
                </ScrollView>           
            </View>
             
          </View>
          <ImageOverlay containerStyle={isSidebar ? {position: 'absolute', height: '100%', opacity: 0.7} : {position: 'absolute', height: '0%', opacity: 0.7}} resizeMode="contain" source={require("../images/blur.png")} />
        </View>
        
      </View>
    );
  }
}

export default Edit;

const { width: viewportWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row"
  },
  contentContainer: {
    flex: 21,
    backgroundColor: "#fff",
    flexDirection: "row"
  },
    content: {
      position: 'absolute',
      height: '100%',
      width: '100%'
    },
      headerContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: '5%',
        paddingRight: '5%',
        paddingBottom: hp('3%'),
        borderBottomColor: '#E2E2E2',
        borderBottomWidth: 0.5,
        backgroundColor: '#FAFC00'
      },
        sidebarMenu: {
          flex: 1,
          marginTop: hp('7%')
        },
          sidebarMenuImage: {
            width: 20,
            height: 15
          },
          tvIconImage: {
            width: 17,
            height: 17
          },
        homeLogo: {
          flex: 2,
          alignItems: 'center',
          marginTop: hp('6%'),
          marginLeft: '5%',
        },

        homeLogoText: {
            fontSize: 16,
            marginTop: '5%',
            fontWeight: 'bold',
            width: '100%',
            marginLeft:'15%'
        },
        
        tvIcon: {
          flex: 1,
          alignItems: 'flex-end',
          marginTop: '18%'
        },

      bodyContainer: {
        flexDirection: 'column',
        flex: 9
      },

      // this is for profile image style
        profileImageContainer: {
          borderRadius: 220,
          borderWidth: 3,
          borderColor: '#000',
          width: 130, 
          height: 130,
          backgroundColor: '#ddd',
          alignItems: 'center',
          justifyContent: 'center'
        },
        profileImage:{
          width: 123, 
          height: 123,
          borderRadius: 220,
        },
        profileLogo: {
          height: '40%',
          width: '20%'
        },
        profileLogoContainer: {
          backgroundColor: 'green'
        },
        profileImageTouch: {
        //  backgroundColor: '#f00'
        },  
        profileContainer: {
            backgroundColor: '#FAFC00',
            height: hp('9%'),
        },
        userImage: {
            height: hp('15%'),
            // backgroundColor: '#000'
        },
        btnGroup: {
            position: 'absolute',
            flexDirection: 'row',
            marginLeft: '5%',
            marginRight: '5%',
            // top: hp('1%')
            marginTop: hp('1.5%'),
            // backgroundColor: '#f00'
        },
            logo: {
                flex: 1,
                alignItems: 'center',
            },
            fBtnContainer: {
                flex: 1,                
                paddingTop: '14%'
            },
            favoritesBtn: {
                borderWidth: 2,
                borderRadius: 5,
                backgroundColor: '#000',
                paddingLeft: '3%',
                paddingRight: '3%',
                alignItems: 'center',
                width: '70%',
                // marginTop: '35%'
            },
            favoritesText: {
                color: '#fafc00',
                fontWeight: 'bold',
                fontSize: 12,
                marginTop: '9%',
                marginBottom: '9%'
            },
            oBtnContainer: {
              flex: 1,
              alignItems:"flex-end",
              paddingTop: '14%'
            },
            orderBtn: {
                // width: '70%',
                borderWidth: 2,
                borderRadius: 5,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center'                
            },
            orderText: {
                color: '#000',
                fontWeight: 'bold',
                fontSize: 12,
                marginTop: '8%',
                marginBottom: '8%',
                marginLeft: '14%',
                marginRight: '14%'
            },
          formContainer: {
            // marginTop: '10%',
            marginLeft: '5%',
            marginRight: '5%',
            marginBottom: '5%',
            marginTop: '5%'
          },
          multiInput: {
              flexDirection: 'row',
          },
          changeContainer: {
            flex: 2,
          },
            change: {
              padding: '5%'
            },
            // black button
            shipping: {
              backgroundColor: '#000',
              borderRadius: 5,
              paddingTop: '2%',
              paddingBottom: '2%',
              paddingLeft: '3%',
              paddingRight: '3%',
              width: '40%'
            },
            shippingText: {
              color: '#fff',
              fontSize: 13
            },
      
            // here is btnGroup
            chnageBtnContainer: {
              flexDirection: 'row',
              marginTop: '5%',
              fontSize:13
            },
            chnageBtnContainer2: {
              flexDirection: 'row',
              marginTop: '3%',
              fontSize:13
            },
            changeDetail: {
              // marginLeft: '10%'
            },
            shippingImage: {
              height: 30,
              width: 50
            },
      
            //white button
            changeBtn: {
              backgroundColor: '#fff',
              borderRadius: 5,
              borderWidth: 2,
              borderColor: '#000',
              alignItems: 'center',
              justifyContent: 'center',
              height: 35,
              paddingLeft: '3%',
              paddingRight: '3%',
              marginLeft: '18%'
            },
            changeBtnText: {
              fontWeight:'bold'
            },
            payContainer: {
              flex: 1,
              backgroundColor: '#000'
            },
              payTotalContainer: {
                flexDirection: 'row',
                marginTop: '3%',
                marginBottom: '3%'
              },
              payTotal: {
                color: '#fff',
                fontSize: 18,
                marginLeft: '40%'
              },
              payTotalPrice: {
                color: '#fff',
                fontSize: 18,
                fontWeight: 'bold'
              },
              paymentImage: {
                height: 30,
                width: 50,
                marginTop: '10%'
              },
              payNumber: {
                flexDirection: 'row',
              },
              dots: {
                fontWeight: 'bold',
                fontSize: 23,
                marginLeft: '10%',
              },
              number: {
                fontSize: 16,
                marginTop: '6%',
                marginLeft: '3%'
              },
        saveBtn: {
          alignItems: 'center',
          marginBottom: '10%'
        },
        saveBtnImage : {
          // width: wp('99%'),
          // width: '100%',
          height: wp('13%')
        },

        // payment modal
        saveImage1: {
          width: '100%',
          height: 52,
        },
        paymentModalBottom: {
          marginTop: '5%'
        },
        multiInput: {
          flexDirection: 'row'
        },
        paymentDate: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingLeft: '5%',
          paddingRight: '5%',
          marginTop: '5%'
        },
        paymentNumber: {
          flexDirection: 'row',
          paddingBottom: '5%'
        },
        dots1: {
          fontWeight: 'bold',
          fontSize: 25,
          paddingBottom: '3%',
          marginLeft: '5%'
        },
        number1: {
          fontSize: 16,
          marginTop: '4%',
          marginLeft: '3%'
        },
        detailImages: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: '5%'
        },
        detailImage1: {
          height: 25,
          width: 40
        },
        detailImage2: {
          height: 35,
          width: 20
        },
        paymentDetail: {
          borderWidth: 2,
          borderColor: '#000',
          borderRadius: 5,
          marginTop: '5%'
        },
        paymentImage1: {
          height: 30,
          width: '75%',
          marginTop: '2%'
        },
        paymentModalHeader: {
          width: '100%',
          flexDirection: 'row'
        },
        position: {
          position: 'absolute',
          bottom: 0,
          // height: '35%',
          backgroundColor: '#f00'
        },
        modalContainer1: {
          paddingRight: '4%',
          paddingLeft: '4%',
          paddingTop: '2%',
          height: '73%',
          width: '100%',
          // backgroundColor: '#fafc00'
        },

        
        
        // shipping modal
        modalContainer: {
          height: hp('60%'),
          // backgroundColor: '#fafc00'
        },
        shipModalHeader: {
          width: '100%',
          flexDirection: 'row',
          paddingTop: '5%'
        },
        shipModalBody: {
            
        },
        shipModalBottom: {
          
        },
        cancelImage: {
          width: 15
        },
        shippingImage2: {
          height: 30,
          marginTop: '2%'
        },
        saveImage: {
          width: '100%',
          height: 52
        },
});


const images = {
    carouselImage1: require('../images/carousel1.png'),
    carouselImage2: require('../images/carousel2.png'),
    playIcon1: require('../images/playIcon1.png'),
    productImage1: require('../images/productImage1.png'),
    smallItemImage: require('../images/smallItemImage1.png'),
    sItemPlayImage: require('../images/playIcon2.png'),
    logoImage: require('../images/logo.png')
};