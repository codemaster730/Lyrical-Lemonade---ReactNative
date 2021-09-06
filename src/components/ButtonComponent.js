import React, { useState, useEffect } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  Animated,
  Button
} from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';


// You can then use your `FadeInView` in place of a `View` in your components:
class Cart extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    const btnColor = this.props.btnColor;
    const btnText = this.props.btnText;
    const width = this.props.width;
    const height = this.props.height;
    const marginLeft = this.props.marginLeft;
    const marginRight = this.props.marginRight;
    const size = this.props.size;

    if(btnColor == 'black') {
        return (
            <View style={[styles.shipping, {width: width, height: height, marginLeft: marginLeft, marginRight: marginRight}]}>
                <Text  style={styles.shippingText}>{btnText}</Text>
            </View>
        );
    }
    if(btnColor == 'white') {
        return (
            <View style={[styles.changeBtn, {width: width, height: height, marginLeft: marginLeft, marginRight: marginRight}]}>
                {size != 'big' ? <Text style={styles.changeBtnText}>{btnText}</Text> : <Text style={styles1.text}>{btnText}</Text>}
            </View>
        );
    }
  }
}

export default Cart;

const styles1 = StyleSheet.create({
    text: {
        marginTop: '0%',
        marginBottom: '0%'
    }
});

const styles = StyleSheet.create({
      // black button
      shipping: {
        backgroundColor: '#000',
        borderRadius: 5,
        paddingTop: '2%',
        paddingBottom: '2%',
        paddingLeft: '3%',
        paddingRight: '3%',
        // width: '40%'
        alignItems: 'center'
      },
      shippingText: {
        color: '#fff',
        fontSize: 13
      },

      //white button
      changeBtn: {
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
      },
      changeBtnText: {
        fontWeight:'bold',
        marginTop: '10%',
        marginBottom: '10%',
        paddingLeft: wp('5%'),
        paddingRight: wp('5%'),
        textAlign: 'center'
      },
});
