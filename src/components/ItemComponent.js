import React, { useState, useEffect } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  Animated,
  Linking
} from 'react-native';
import Video from 'react-native-video';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import ImageOverlay from "react-native-image-overlay";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
  } from 'react-native-responsive-screen';

// You can then use your `FadeInView` in place of a `View` in your components:
class ItemComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    

    render(){
        const carouselItemImage = this.props.carouselItemImage;
        const source = carouselItemImage;
        const itemTitle = this.props.itemTitle;
        const itemSubTitle = this.props.itemSubTitle;
        const link = this.props.link;
        const carouselItemPlayImage = this.props.carouselItemPlayImage;
        const height = this.props.height || '100%';
        const navigation = this.props.navigation;
        const blog = this.props.blog || false;

        const videoId = this.props.videoId;
        const playlistId = this.props.playlistId;
        const releasedAt = this.props.releasedAt;
        const title = this.props.title;
        const description = this.props.description;

        return (
            <View style={styles.carouselItem}>
                <TouchableOpacity onPress={() => {
                    blog ? navigation.navigate('BlogShow', {link: link}) : navigation.navigate('VideoPlay', {
                        videoId : videoId,
                        playlistId : playlistId,
                        releasedAt : releasedAt,
                        title : title,
                        description : description,
                        img: "" + source + ""
                    });
                }}>
                <ImageOverlay containerStyle={styles.carouselItemImage} resizeMode="contain" source={{"uri" : "" + source + ""}} />
                <View style={styles.titleContainer}>
                <Text style={styles.itemTitle}>{itemTitle}</Text>
                <Text style={styles.itemSubTitle}>{itemSubTitle}</Text>
                </View>
                <View style={styles.carouselItemPlay}>
                    <Image style={styles.carouselItemPlayImage} resizeMode="contain" source={carouselItemPlayImage} />
                </View>
                </TouchableOpacity>
            </View>
        );
    }
}

export default ItemComponent;

const styles = StyleSheet.create({
        carouselItem: {
            height: 250,
        },
        carouselItemImage: {
            width: '100%',
            height: 220,
            borderRadius: 5
        },
        titleContainer: {
            position: 'absolute',
            left: '5%',
            top: '6%',
            width: '90%'
        },
        itemTitle: {
            color: "#fff",
            fontSize: 19,
            
        },
        itemSubTitle: {
            color: "#FAFC00",
            fontSize: 13,
            marginTop: '2%'
            
        },
        carouselItemPlayImage: {
            width: 35,
            height: 35,
        },
        carouselItemPlay: {
            position: 'absolute',
            bottom: '10%',
            right: '5%'
        }
});
