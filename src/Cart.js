import React, { useState, useEffect } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
  Image,
  ImageBackground,
  StyleSheet,
  Animated,
  Button,
  TouchableHighlight,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import Overlay from 'react-native-modal-overlay';

import ButtonComponent from './components/ButtonComponent';
import InputComponent from './components/InputComponent';
import Dialog, { DialogFooter, DialogButton, DialogContent} from 'react-native-popup-dialog';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import Modal, { ModalContent, ModalFooter, ModalButton } from 'react-native-modals';

// You can then use your `FadeInView` in place of a `View` in your components:
class Cart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shippingModal: false,
      paymentModal: false,
      isShipModal: false
    }
  }

  _setShippingModalShow() {
    this.setState(prev => ({shippingModal: true}));
    this.setState({isShipModal: true});
  }

  _setShippingModalHide = () => this.setState({shippingModal: false});
  
  _setPaymentModalShow()  {
    this.setState(prev => ({paymentModal: true}));
  }

  _setPaymentModalHide = () => this.setState({paymentModal: false});

  render(){

    return (
      <View style={styles.container}>
        <View style={[styles.contentContainer]}>
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
                        <InputComponent label="Street" place="143 Lemon Drop Ave" mTop="0%"></InputComponent>
                        <View style={{height: '5%'}}></View>
                        <InputComponent label="Country" place="United States" mTop="0%"></InputComponent>
                        <View style={{height: '5%'}}></View>
                        <InputComponent label="State" place="California" mTop="0%"></InputComponent>
                        <View style={{height: '5%'}}></View>
                        <InputComponent label="State" place="Los Angeles" mTop="0%"></InputComponent>
                      </View>
                      <View style={styles.shipModalBottom}>
                        <Image resizeMode="contain" source={require('../images/save.png')} style={styles.saveImage} />
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
                    <ScrollView>
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
                        <View style={{height: '5%'}}></View>
                        <InputComponent label="Card Number" place="7283 2839 4739 3127" mTop="0%"></InputComponent>
                        <View style={{height: '5%'}}></View>
                        <InputComponent label="Name on card" place="Tommy Bahama" mTop="0%"></InputComponent>
                        <View style={styles.multiInput}>
                          <InputComponent width="100%" label="Experation Date" secure={false} place="02 / 22" flexNum={1} mTop="2%"></InputComponent>
                          <InputComponent width="100%" label="Security Code" secure={false} place="342" flexNum={1} mLeft="10%" mTop="2%"></InputComponent>
                      </View>
                    </View>
                    <View style={styles.paymentModalBottom}>
                      <Image resizeMode="contain" source={require('../images/save.png')} style={styles.saveImage1} />
                    </View>
                    </ScrollView>
                  </DialogContent>
          </Dialog>

            <View style={styles.headerContainer}>

              <View style={styles.cancel}>
                <TouchableOpacity onPress={() => {this.props.navigation.navigate('Profile')}}>
                  <Image resizeMode="contain" style={styles.sidebarMenuImage} source={require('../images/cancelIcon.png')} />
                </TouchableOpacity>
              </View>

              <View style={styles.homeLogo}>
                <Image resizeMode="contain" style={styles.tvIconImage} source={require('../images/cart.png')} />
                <Text style={styles.homeLogoText}>CART</Text>
              </View>              

            </View>

            <View style={styles.bodyContainer}>
              <ScrollView>
                <View style={styles.productContainer1}>
                  <View style={styles.productLogo}>
                    <Image style={styles.productLogoImage} resizeMode="contain" source={require('../images/productImage1.png')} />
                  </View>
                  <View style={styles.productDetail}>
                    <Image style={styles.deleteImage} resizeMode="contain" source={require('../images/delete.png')} />
                    <Text style={styles.productDetailTitle}>The Lemon Man Tee No.3 (Black)</Text>
                    <View style={styles.quantityPrice}>
                      <Text style={styles.productSize}>M</Text>
                      <Text style={styles.dot}>.</Text>
                      <Text style={styles.productPrice}>$40</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.productContainer2}>
                  <View style={styles.productLogo}>
                    <Image style={styles.productLogoImage} resizeMode="contain" source={require('../images/productImage1.png')} />
                  </View>
                  <View style={styles.productDetail}>
                    <Image style={styles.deleteImage} resizeMode="contain" source={require('../images/delete.png')} />
                    <Text style={styles.productDetailTitle}>The Lemon Man Tee No.3 (Black)</Text>
                    <View style={styles.quantityPrice}>
                      <Text style={styles.productSize}>M</Text>
                      <Text style={styles.dot}>.</Text>
                      <Text style={styles.productPrice}>$40</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>

            <View style={styles.changeContainer}>
              <ScrollView>
                <View style={styles.change}>

                  <ButtonComponent btnColor="black" btnText="SHIPPING ADDRESS" width={wp("39%")}></ButtonComponent>
                  
                  <View style={styles.chnageBtnContainer}>
                    <View style={{flex: 1}}><Image style={styles.shippingImage} resizeMode="contain" source={require("../images/shipping.png")} /></View>
                    <View style={[styles.changeDetail, {flex: 4}]}>
                      <Text>143 Lemon Drop Ave</Text>
                      <Text>Los Angeles, CA 92200</Text>
                    </View>

                    <TouchableOpacity style={{flex: 1}} onPress={() => {this._setShippingModalShow()}}>
                      <ButtonComponent btnColor="white" btnText="CHANGE"></ButtonComponent>
                    </TouchableOpacity>
                    
                  </View>
                </View>

                <View style={styles.change}>
                  <ButtonComponent btnColor="black" btnText="PAYMENT METHOD" width={wp("38%")}></ButtonComponent>
                  
                  <View style={styles.chnageBtnContainer2}>
                    <View  style={{flex: 1}}><Image style={styles.paymentImage} resizeMode="contain" source={require("../images/payment.png")} /></View>
                    <View style={[styles.payNumber, {flex: 4}]}>
                      <Text style={styles.dots}>.... .... ....</Text>
                      <Text style={styles.number}>3127</Text>
                    </View>
                    <TouchableOpacity  style={{flex: 4}} onPress={() => {this._setPaymentModalShow()}}>
                      <ButtonComponent btnColor="white" btnText="CHANGE" ></ButtonComponent>
                    </TouchableOpacity>
                    
                  </View>
                </View>
              </ScrollView>
            </View>

            <View style={styles.payContainer}>
              <View style={styles.payTotalContainer}>
                <Text style={styles.payTotal}>Total </Text><Text style={styles.payTotalPrice}> $120</Text>
              </View>
              <View style={styles.paynowBtn}>
                <ButtonComponent btnColor="white" btnText="PAY NOW" marginLeft="5%" marginRight="5%" height={45} size="big"></ButtonComponent>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Cart;

const { width: viewportWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  // modal style
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
    height: '35%',
    backgroundColor: '#f00'
  },
  modalContainer1: {
    paddingRight: '5%',
    paddingLeft: '5%',
    paddingTop: '2%',
    height: '65%',
    width: '100%',
    backgroundColor: '#fafc00'
  },

  
  
  // shipping modal
  modalContainer: {
    height: hp('60%'),
    backgroundColor: '#fafc00'
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

  // payment css
  

  // cart css
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
        borderBottomColor: '#E2E2E2',
        borderBottomWidth: 0.5,
      },
        cancel: {
          flex: 1,
          marginTop: '20%'
        },
          sidebarMenuImage: {
            width: 20,
            height: 15
          },
          homeLogoImage: {
            width: 110,
            height: 35
          },
          tvIconImage: {
            width: 30,
            height: 20
          },
        homeLogo: {
          flex: 2,
          marginTop: '17%',
          flexDirection: 'row',
          marginTop: '19%',
          paddingLeft: '10%'
        },

        homeLogoText: {
            fontSize: 16,
            marginLeft: '3%',
            marginTop: '1%',
            fontWeight: 'bold'
        },
        
        tvIcon: {
          flex: 1,
          alignItems: 'flex-end',
          marginTop: '18%'
        },

      bodyContainer: {
        flex: 3,
        paddingLeft: '5%',
        paddingRight: '5%',
        // backgroundColor: "green"
      },
        productContainer1: {
          flexDirection: 'row',
          paddingBottom: '5%',
          paddingTop: '5%',
          borderBottomColor: '#7f7f7f',
          borderBottomWidth: 0.5
        },
        productContainer2: {
          flexDirection: 'row',
          paddingBottom: '5%',
          paddingTop: '5%'
        },
        productLogoImage: {
          width: 140,
          height: 140
        },
        deleteImage: {
          width: 18,
          // marginLeft: '71%'
        },
        productLogo: {
          flex: 2
        },
        productDetail: {
          flex: 3,
          alignItems: 'flex-end'
        },
        productDetailTitle: {
          width: wp('40%'),
          fontSize: 17,
          textAlign: "right",
          // marginLeft: '13%'
        },
        quantityPrice: {
          flexDirection: 'row',
          // marginLeft: '51%',
          // marginTop: '2%'
        },
        productSize: {
          fontSize:23,
          marginTop: '2%'
        },
        dot: {
          fontSize: 23,
          fontWeight: 'bold',
          marginLeft: '2%',
          marginRight: '2%'
        },
        productPrice: {
          fontSize: 23,
          fontWeight: 'bold',
          marginTop: '2%'
        },

    changeContainer: {
      flex: 2,
      backgroundColor: '#fafc00'
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
        marginLeft: '4%'
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
      paynowBtn: {
        
      }
});

const images = {
    carouselImage1: require('../images/carousel1.png'),
    carouselImage2: require('../images/carousel2.png'),
    carouselImage3: require('../images/carouselImage3.png'),
    playIcon1: require('../images/playIcon1.png'),
    productImage1: require('../images/productImage1.png'),
    smallItemImage: require('../images/smallItemImage1.png'),
    sItemPlayImage: require('../images/playIcon2.png'),
};