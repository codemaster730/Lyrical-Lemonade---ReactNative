import React, { useState, useEffect } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  Animated
} from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import ImageOverlay from "react-native-image-overlay";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
  } from 'react-native-responsive-screen';

// You can then use your `FadeInView` in place of a `View` in your components:
class ProductComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        
        const productImage = this.props.productImage;
        const size = this.props.size;
        const hot = this.props.hot;
        const plus = this.props.plus;
        const price = this.props.price;
        const desc = this.props.desc;
        const navigation = this.props.navigation;
        
        const hotComponent = () => {
            return (
                <View style={styles.hotContainer}>
                    <Image style={styles.hotImage} resizeMode="contain" source={require("../../images/hot.png")} />
                </View>
            );
        }

        const productBottomComponent = () => {
            return (
                <View style={size != 'small' ? styles.productBottom : styles.productBottom1}>
                    { size == 'small' ? <Text style={[styles.description, styles.description1]}>{desc}</Text> : <Text style={styles.description}>{desc}</Text> }

                    <View style={ size == 'small' ? [styles.priceAddcart, {width: '60%'}] : styles.priceAddcart}>
                        <Text style={styles.priceText}>{price}</Text>
                        <TouchableOpacity onPress={() => {navigation.navigate('Item')}}>
                            <Image style={[styles.priceImage, {}]} resizeMode="contain" source={require("../../images/plus.png")} />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.carouselItem}>
                <Image style={size == 'small' ? styles.carouselItemImageSmall : styles.carouselItemImageBig} resizeMode="contain" source={productImage} />
                { hot ? hotComponent() : null }
                { plus ? productBottomComponent() : null }
            </View>
        );
    }
}

export default ProductComponent;

const styles = StyleSheet.create({
    carouselItem: {
        flex: 1,
        marginLeft: '1%',
        marginRight: '1%',
    },
    carouselItemImageSmall: {
        width: '100%',
        height: 190,
        borderRadius: 5
    },
    carouselItemImageBig: {
        width: '100%',
        height: 400,
        borderRadius: 5
    },
    hotContainer: {
        backgroundColor: '#fff',
        position: 'absolute',
        // top: '7%',
        top: '11%',
        left: '3%',
        borderRadius: 5,
        // height:30,
        width: 80,
        alignItems: 'center'
    },
        hotImage: {
            height:30,
            width: 60            
        },
    productBottom: {
        position: 'absolute',
        // bottom: '7%'
        bottom: hp('6%')
    },
    productBottom1: {
        position: 'absolute',
        top: hp('11%')
    },
        priceAddcart: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: '3%',
            paddingRight: '3%',
            // marginTop: '1%',
            width: '79%',  
        },
        description: {
            fontSize: 18,
            paddingLeft: '4%',
            color: 'white',
        },
        description1: {
            width: '55%', 
            // top: hp('10%'),?
            // backgroundColor: '#000'
        },
        priceText: {
            fontSize: 32,
            fontWeight: 'bold',
            color: '#FAFC00'
        },
        priceImage: {
            width: 35,
            height: 35,
        }
});