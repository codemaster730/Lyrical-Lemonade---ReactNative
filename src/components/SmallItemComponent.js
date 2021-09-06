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
import { heightPercentageToDP } from 'react-native-responsive-screen';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
  } from 'react-native-responsive-screen';

// You can then use your `FadeInView` in place of a `View` in your components:
class SmallItemComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        const smallItemImage = this.props.smallItemImage;
        const sitemTitle = this.props.sitemTitle;
        const sitemSubTitle = this.props.sitemSubTitle;
        const sItemPlayImage = this.props.sItemPlayImage;
        const navigation = this.props.navigation;

        const videoId = this.props.videoId;
        const playlistId = this.props.playlistId;
        const releasedAt = this.props.releasedAt;
        const title = this.props.sitemTitle;
        const description = this.props.description;

        return (
            <View style={styles.smallItemContainer}>
                <View style={styles.smallItem}>
                    <Image style={styles.smallItemImg} resizeMode="contain" source={{"uri" : "" + smallItemImage + ""}} />
                    <View style={styles.titleGroup}>
                        <Text style={styles.sitemTitle}>{sitemTitle}</Text>
                        <Text style={styles.sitemSubTitle}>{sitemSubTitle}</Text>
                    </View>
                </View>
                <View style={styles.sItemPlay}>
                    <TouchableOpacity   onPress={() => {navigation.navigate('VideoPlay', {
                            videoId : videoId,
                            playlistId : playlistId,
                            releasedAt : releasedAt,
                            title : title,
                            description : description
                        })}}>
                        <Image style={styles.sItemPlayImage} resizeMode="contain" source={sItemPlayImage} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default SmallItemComponent;

const styles = StyleSheet.create({
    smallItemContainer: {
        borderTopColor: '#ccc',
        borderTopWidth: 0.5,
        paddingTop: '5%',
        paddingBottom: '5%',
    },
    smallItem: {
        flexDirection: 'row'
    },
    smallItemImg: {
        width: 120,
        height: 90,
        borderRadius: 10,
    },
    titleGroup: {
      width: '63%',
      marginLeft: '5%',
      marginTop: '3%'
    },
    sitemTitle: {
        fontSize: 16,
    },
    sitemSubTitle: {
        color: '#a5a5a5',
        marginTop: '1%'
    },
    sItemPlay: {
        position: 'absolute',
        top: hp('4.2%'),
        left: '9.5%'
    },
    sItemPlayImage: {
        width: 50,
        height: 50
    }
}); 
