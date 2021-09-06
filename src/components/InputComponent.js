import React from 'react';
import {
    Platform,
    ScrollView,
    Text,
    View,
    Image,
    StyleSheet
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
  } from 'react-native-responsive-screen';
  import { initialMode } from 'react-native-dark-mode';

class InputComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const value = this.props.initValue;

        return (
            <View style={[styles.container, {flex: this.props.flexNum, marginTop: hp(this.props.mTop), marginLeft: this.props.mLeft}]}>
                <View style={styles.labelContainer}>
                    <Text  style={styles.label}>{this.props.label}</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput style={[styles.input, {width: this.props.width}]} placeholder={this.props.place} placeholderTextColor="#777" secureTextEntry={this.props.secure}  onChangeText={ text => {
                        this.props.inputFunc(text);
                    }} value={value}/>
                </View>
            </View>    
        );
    }
}

export default InputComponent;

const styles = StyleSheet.create({
    container: {
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
        }
});