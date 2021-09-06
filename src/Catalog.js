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
  TouchableWithoutFeedback
} from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { SimpleAnimation } from 'react-native-simple-animations';
import SidebarComponent from './components/SidebarComponent';
import CarouselComponent from './components/CarouselComponent';
import ItemComponent from './components/ItemComponent';
import { StackView } from 'react-navigation-stack';
import ProductComponent from './components/ProductComponent';
import ImageOverlay from 'react-native-image-overlay';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import Spinner from 'react-native-loading-spinner-overlay';
import base64 from 'react-native-base64';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

// You can then use your `FadeInView` in place of a `View` in your components:
class Catalog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSidebar: false,
      products: [],
      spinnerState: false,
      auth: ''
    }

    const self = this;
  }

  _animationView() {
    return (
      <SimpleAnimation delay={0} duration={1000} direction="right" style={{flex: 4}}>
        <SidebarComponent navigation={this.props.navigation}  pageName="Shop"  hideAgain={() => this._hideSidebar()}></SidebarComponent>
      </SimpleAnimation>
    );
  }

  _hideSidebar() {
    this.setState(prev => ({
      isSidebar: false
    }));
  }

  _showSidebar() {
    this.setState(prev => ({
      isSidebar: true
    }));
  }

  componentDidMount() {
    this._getProducts();
  }

  async _getProducts() {
    this.setState({spinnerState: true});
    var headers = new Headers();
    headers.append('Authorization', 'Basic ' + base64.encode('8c1ecb52c850c9e05c2eeca3c2bffdba' + ':' + '793cb4efe34466cca7cf9e15bfbf3c6a'));
    const response = await fetch("https://shop-lyrical-lemonade.myshopify.com/admin/api/2020-01/products.json", {method: 'GET', headers: headers});
    const json = await response.json();
    console.log(json);
    this.setState(prev => ({products: json.products}));
    this.setState({spinnerState: false});
  }

  onSwipeRight(gestureState) {
    this.setState(prev => ({
      isSidebar: true
    }));
  }

  render(){
    const isSidebar = this.state.isSidebar;
    const products = this.state.products;
    var isProducts = 0;

    const ProductsView = products.map(product => {
      const title = product.title;
      const product_link = product.handle;
      // this is for getting price
      const variants = product.variants;
      var priceArr = [];
      var empty = false;
      
      variants.map(v => {
        if(v.inventory_quantity == 0 || v.price == 0.00) {
          empty = true;
        }
        var key = v.title;
        key = key.replace(/\s+/g, '');
        var val = v.price;
        var obj = {};
        obj[key] = val;
        priceArr.push(obj);
      });
      if(product.published_at == null || product.tags != "Lemonade") {
        empty = true;
      }
      if(priceArr[0] != 'undefinded'){
        var priceTmp = JSON.stringify(priceArr[0]);
        var price = priceTmp.split(':');
        price = price[1].split('"');
        price = price[1];
      }else{
        price="no price";
      }
      // this is for getting image
      const imageObj = product.image;
      if(imageObj == null) {
        var imageUrl = "no";
      }else{
        var imageTmp = new Object(imageObj);
        var imageOrigin = imageTmp.src;
        var tmp = imageOrigin.split('.png');
        var imageUrl = tmp[0] + '_medium.png' + tmp[1];
      }
      
      if(empty == false) {
        isProducts += 1;
        return (
          <View key={product.id} style={imageUrl == 'no' ? {borderRadius:10, marginTop:'5%', backgroundColor: '#ddd'} : {borderRadius:10, marginTop:'5%', backgroundColor: '#ddd'}}>
            <View style={{}}>
              <Image resizeMode="contain" source={{'uri':""+imageUrl+""}} style={{width: '100%', height: 373, borderRadius:10}} />
            </View>
            <View style={{width:'80%', position: 'absolute', bottom:'0%', left: '5%',marginBottom: '3%'}}>
              <View style={{paddingRight: '0%'}}>
                <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>{title}</Text>
                <Text style={{color: '#fafc00', fontSize: 28, fontWeight: 'bold'}}>${price}</Text>
              </View>
            </View>
            <View style={{position: 'absolute', bottom: '0%', right: '5%', marginBottom: '3%'}}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate("ProductView", {
                'product_id': product.id,
                'title' : title,
                'priceArr' : priceArr,
                'images' : product.images,
                'variants' : product.variants,
                'imageUrl' : imageUrl,
                'product_link' : product_link
              })}>
                <Image source={images.plusImage} style={{width:40, height: 40}} />
              </TouchableOpacity>
            </View>
          </View>
        );
      }else{
        // return <Text>No Products</Text>;
      }
      
    });

    const additionalStyle = isSidebar ? StyleSheet.create({
      sidebarStyle: {
        // opacity: 0.3
      }
    }) : StyleSheet.create({
      sidebarStyle: {
        opacity: 1
      }
    });

    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinnerState } />
        {isSidebar ? this._animationView() : null}
          <View style={[styles.contentContainer, additionalStyle.sidebarStyle]}>
          {/* <GestureRecognizer
            // onSwipeLeft={(state) => this.onSwipeLeft(state)}
            onSwipeRight={(state) => this.onSwipeRight(state)}
            style={{
              flex: 1,
              backgroundColor: this.state.backgroundColor
            }}
          > */}
          <View style={styles.content}>
            <View style={styles.headerContainer}>

              <View style={styles.sidebarMenu}>
                <TouchableOpacity onPress={() => {this._showSidebar()}}>
                  <Image resizeMode="contain" style={styles.sidebarMenuImage} source={require('../images/navIcon.png')} />
                </TouchableOpacity>
              </View>

              <View style={styles.homeLogo}>
                <Text style={styles.homeLogoText}>SHOP</Text>
              </View>

              <View style={styles.tvIcon}>
                <TouchableOpacity>
                  <Image resizeMode="contain" style={styles.tvIconImage} source={require('../images/cart.png')} />
                </TouchableOpacity>
              </View>

            </View>

            <View style={styles.bodyContainer}>
              <ScrollView>
                {
                  isProducts == 0 ? <Text style={{color: '#000', fontSize: 30, textAlign:'center', marginTop: '5%'}}>No products</Text> : null
                }
                <View style={{marginBottom: '5%'}}>
                  {
                    ProductsView
                  }
                </View>
              </ScrollView>
            </View>
          </View>
          <ImageOverlay containerStyle={isSidebar ? {position: 'absolute', height: '100%', opacity: 0.7} : {position: 'absolute', height: '0%', opacity: 0.7}} resizeMode="contain" source={require("../images/blur.png")} />
          {/* </GestureRecognizer> */}
        </View>
      </View>
    );
  }
}

export default Catalog;

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
        borderBottomColor: '#E2E2E2',
        borderBottomWidth: 0.5,
      },
      searchContainer: {
        marginBottom: '5%'
      },
      sidebarMenu: {
        flex: 1,
        // marginTop: '20%'
        marginTop: hp('8%')
      },
        sidebarMenuImage: {
          width: 20,
          height: 15
        },
        homeLogoText: {
          fontWeight: 'bold',
          fontSize: wp('3.5%')
        },
        tvIconImage: {
          width: 17,
          height: 17
        },
      homeLogo: {
        flex: 1,
        alignItems: 'center',
        // marginTop: '17%'
        marginTop: hp('8%')
      },
      tvIcon: {
        flex: 1,
        alignItems: 'flex-end',
        // marginTop: '18%'
        marginTop: hp('8%')
      },

      bodyContainer: {
        flex: 7,
        paddingLeft: '5%',
        paddingRight: '5%',
      },
});


const images = {
    carouselImage1: require('../images/carousel1.png'),
    carouselImage2: require('../images/carousel2.png'),
    carouselImage3: require('../images/carouselImage3.png'),
    playIcon1: require('../images/playIcon1.png'),
    productImage1: require('../images/productImage1.png'),
    smallItemImage: require('../images/smallItemImage1.png'),
    sItemPlayImage: require('../images/playIcon2.png'),
    plusImage:  require('../images/plus.png'),
};