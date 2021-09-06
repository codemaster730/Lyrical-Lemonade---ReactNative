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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { WebView } from 'react-native-webview';
import Spinner from 'react-native-loading-spinner-overlay';

// You can then use your `FadeInView` in place of a `View` in your components:
class ProductView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        spinnerState: false
    }
  }

  componentDidMount() {
    
  }


    render(){
    const product_link = this.props.navigation.getParam('product_link');

    return (
      <View style={styles.container}>
        <Spinner
            visible={this.state.spinnerState}
        />
        <View style={[styles.contentContainer]}>
            <View style={styles.content}>
                <View style={styles.headerContainer}>
                    <View style={styles.sidebarMenu}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Image resizeMode="contain" style={styles.sidebarMenuImage} source={require('../images/arrow.png')} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.homeLogo}>
                        <Text style={styles.homeLogoText}>Shop</Text>
                    </View>

                    <View style={styles.tvIcon}>                 
                        {/* <Image resizeMode="contain" style={styles.tvIconImage} source={require('../images/cart.png')} /> */}
                    </View>              
                </View>

                <View style={styles.bodyContainer}>
                    <WebView
                        source={{uri: "https://shop.lyricallemonade.com/products/" + product_link}}
                        onLoadStart = {() => this.setState({spinnerState: true})}
                        onLoadEnd = {() => this.setState({spinnerState: false})}
                        contentInset={{top: 0}}
                        scrollEnabled = {true}
                    />
                </View>
            
            </View>
        </View>
      </View>
    );
  }
}

export default ProductView;

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
          height: '100%',
          width: '100%',
          flex: 1
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
            backgroundColor: '#222323',
            height: '100%'
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
};