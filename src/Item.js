import React, { useState, useEffect } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  Animated,
  Button,
  ImageBackground
} from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { SimpleAnimation } from 'react-native-simple-animations';
import SidebarComponent from './components/SidebarComponent';
import CarouselComponent from './components/CarouselComponent';
import ItemComponent from './components/ItemComponent';
import { StackView } from 'react-navigation-stack';
import ProductComponent from './components/ProductComponent';
import Dialog, { SlideAnimation, DialogContent} from 'react-native-popup-dialog';
import { BlurView } from 'react-native-blur';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';

// You can then use your `FadeInView` in place of a `View` in your components:
class Item extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    }
  }

  _showModal() {
    this.setState(() => ({visible : true}));
  }

  _hideModal() {
    this.setState(() => ({visible : false}));
  }

  _animationView() {
    return (
      <SimpleAnimation delay={3} duration={1000} direction="bottom">
        <View style={{height: 450, backgroundColor: '#fff', borderRadius: 15, paddingRight: '5%', paddingLeft: '5%'}}>
          <View style={styles.itemDesc}>
            <View style={styles.item}>
              <ProductComponent hot={false} plus={false} price="" desc="" size="small" productImage={images.productImage1} ></ProductComponent>
            </View>
            <View style={styles.descGroup}>
              <Text style={styles.descText}>The Lemon Man Tee No.3 (Black)</Text>
              <Text style={styles.descPrice}>$80</Text>
            </View>
          </View>

          <View style={styles.itemSize}>
            <Text style={styles.sizeTitle1}>SELECT SIZE</Text>
            <View style={styles.sizes}>
              <Text style={styles.size1}>S</Text>
              <Text style={styles.size1}>M</Text>
              <Text style={styles.size1}>L</Text>
              <Text style={styles.size2}>XL</Text>
              <Text style={styles.size3}>XXL</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => {this._hideModal()}}>
            <Image style={styles.addtocart} resizeMode="contain" source={require('../images/addtocart.png')} /> 
          </TouchableOpacity>
        </View>
      </SimpleAnimation>
    );
  }

  render(){
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          
          <View style={styles.content}>

            <View style={styles.headerContainer}>

              <View style={styles.sidebarMenu}>
                <TouchableOpacity onPress={() => {this.props.navigation.navigate('Catalog')}}>
                  <Image resizeMode="contain" style={styles.sidebarMenuImage} source={require('../images/arrow.png')} />
                </TouchableOpacity>
              </View>

              <View style={styles.homeLogo}>
                <Image resizeMode="contain" style={styles.homeLogoImage} source={require('../images/logo.png')} />
              </View>

              <View style={styles.tvIcon}>
                <TouchableOpacity>
                  <Image resizeMode="contain" style={styles.tvIconImage} source={require('../images/cart.png')} />
                </TouchableOpacity>
              </View>

            </View>

            <View style={styles.bodyContainer}>
              <ScrollView>
              
                <ProductComponent hot={true} plus={false} price="" desc="" size="big" productImage={images.productImage1} ></ProductComponent>

                <View style={styles.productContainer}>
                  <View style={styles.titleDesc}>
                    <View style={styles.desc}>
                      <Text style={styles.descText}>The Lemon Man Tee No.3 (Black)</Text>
                    </View>
                    <View style={styles.price}>
                      <Text style={styles.priceText}>$80</Text>
                    </View>
                  </View>

                  <View style={styles.sizeContainer}>
                    <Text style={styles.sizeTitle}>AVAILABLE SIZES</Text>
                    <View style={styles.sizes}>
                      <Text style={styles.size}>S</Text>
                      <Text style={styles.size}>M</Text>
                      <Text style={styles.size}>L</Text>
                      <Text style={styles.size}>XL</Text>
                      <Text style={styles.size}>XXL</Text>
                    </View>
                  </View>

                  <View style={styles.description}>
                    <Text style={styles.sizeTitle}>DESCRIPTION</Text>
                    <Text style={styles.descriptionText}>
                      Number 3 in the Lemon Man Series. Heavy-weight, 100% cotton fabric, pre-shrunk t-shirt with Glow-in-the-dark oversized screen printed graphic on front. Woven neck label and woven authenticity patch near bottom hem. True to size. Available in Black.
                    </Text>
                  </View>
                </View>
              </ScrollView>
              <View style={styles.buynowContainer}>
                <TouchableOpacity onPress={() => {this._showModal()}}>
                  <Image style={styles.buynow} resizeMode="contain" source={require('../images/buynow.png')} />
                </TouchableOpacity>
              </View>
            </View>

            {this.state.visible ? <View style={{position: 'absolute', width: '100%', height: 600, top: 0, backgroundColor:'rgba( 0, 0, 0, 0.9 )'}}></View> : null}

            <View style={styles.addcartContainer}>
              {this.state.visible ? this._animationView() : null}
            </View>
          </View>
          
        </View>
      </View>
    );
  }
}

export default Item;

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
      width: '100%',
    },
      headerContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: '5%',
        paddingRight: '5%',
        borderBottomColor: '#E2E2E2',
        borderBottomWidth: 0.5,
      },
      sidebarMenu: {
        flex: 1,
        // marginTop: '20%'
        marginTop: hp('7%')
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
          width: 17,
          height: 17
        },
      homeLogo: {
        flex: 1,
        alignItems: 'center',
        // marginTop: '17%'
        marginTop: hp('6%')
      },
      tvIcon: {
        flex: 1,
        alignItems: 'flex-end',
        // marginTop: '18%'
        marginTop: hp('7%')
      },

    bodyContainer: {
      flex: 7,
      paddingLeft: '5%',
      paddingRight: '5%',
    },
    productContainer: {
      flex: 1,
      marginTop: '5%'
    },
    titleDesc: {
      borderBottomColor: "#ccc",
      borderBottomWidth: 0.5,
      flexDirection: 'row',
      paddingBottom: '3%'
    },
    desc: {
      flex: 1
    },
    descText: {
      fontSize: 21
    },
    price: {
      flex: 1,
    },
    priceText: {
      fontSize: 21,
      fontWeight: 'bold',
      textAlign:'right'
    }, 
    sizeContainer: {
      paddingTop: '3%'
    },
    sizeTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: '3%'
    },
    sizes: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    size: {
      fontSize: 16
    },
    description: {
      marginTop: '3%'
    },
    descriptionText: {
      fontSize: 16
    },
    buynow: {
      width: 60,
      bottom: 0,
    },
    buynowContainer: {
      position: 'absolute',
      bottom: 0,
      right: '5%'
    },
    addcartContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
    },
    itemDesc: {
      flexDirection: 'row',
      borderBottomColor: '#ccc',
      borderBottomWidth: 0.5,
      paddingBottom: '15%'
    },
    item: {
      flex: 4
    },
    descGroup: {
      flex: 6,
      alignItems: 'flex-end', 
      marginTop: '15%'
    },
    descText:{
      // textAlign: 'right',
      fontSize: 21
    },
    descPrice: {
      fontSize: 23,
      fontWeight: 'bold',
      marginTop: '5%'
    },
    size1: {
      fontSize: 16,
      borderWidth: 2,
      borderRadius: 5,
      paddingTop: '2%',
      paddingBottom: '2%',
      paddingLeft: '6%',
      paddingRight: '6%',
    },
    size2: {
      fontSize: 16,
      borderWidth: 2,
      borderRadius: 5,
      paddingTop: '2%',
      paddingLeft: '5%',
      paddingRight: '5%',
      backgroundColor: '#fafc00'
    },
    size3: {
      fontSize: 16,
      borderWidth: 2,
      borderRadius: 5,
      paddingTop: '2%',
      
      paddingLeft: '3%',
      paddingRight: '3%',
    },
    sizeTitle1: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: '3%',
      textAlign: 'center',
      marginTop: '10%'
    },
    itemSize: {
      marginBottom: '10%'
    },
    addtocart: {
      height: 70,
      width: '100%',
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