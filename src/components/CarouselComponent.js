import React, { useState, useEffect } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  Animated,
  Dimensions
} from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import ItemComponent from './ItemComponent';
import ProductComponent from './ProductComponent';

import Carousel from 'react-native-snap-carousel';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
  } from 'react-native-responsive-screen';
// You can then use your `FadeInView` in place of a `View` in your components:
class CarouselComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            entries: [],
            isloading: true
        }
    }

    componentDidMount() {
          
        const bigTitle = this.props.bigTitle;
        if(bigTitle == "MUSIC VIDEOS") {
            this._getVideos(50);
        }
        if(bigTitle == "INTERVIEWS") {
            this._getInterviews(50);
        }
        if(bigTitle == "LL2") {
            this._getMerches();
        }
    }

    async _getVideos(param) {
        maxResults = ""+param+"";
        const response = await fetch("https://www.googleapis.com/youtube/v3/playlistItems?playlistId=PLfvpqdsXvlf4vqsRWglvSPplpKkEsBI7E&part=snippet,id&maxResults="+maxResults+"&key=AIzaSyDatqaJO9Q6EdeJXPJ7whIE1Kbya3AeFN8");
        const json = await response.json();
        this.setState({"entries" : json.items});
    }

    async _getInterviews(param) {
        maxResults = ""+param+"";
        const response = await fetch("https://www.googleapis.com/youtube/v3/playlistItems?playlistId=PLfvpqdsXvlf5PDuQtD7q34IiW8elYLOBO&part=snippet,id&maxResults="+maxResults+"&key=AIzaSyDatqaJO9Q6EdeJXPJ7whIE1Kbya3AeFN8");
        const json = await response.json();
        this.setState({"entries" : json.items});
        // this.setState(prev => ({param: (prev.param + 5)}));
    }

    async _getMerches() {
        const response = await fetch("https://www.googleapis.com/youtube/v3/search?key=AIzaSyDatqaJO9Q6EdeJXPJ7whIE1Kbya3AeFN8&channelId=UCMreYZfbzsP4eHgJMlpqRYQ&part=snippet,id&order=date&maxResults=50");
        const json = await response.json();
        this.setState({"entries" : json.items});
    }

    _renderItem = ({item, index}) => {
        const bigTitle = this.props.bigTitle;
        const product = this.props.product;

        // if(bigTitle == "LL2") {
        //     return (
        //         <View style={styles.itemContainer}>
        //             <View style={{flexDirection:'row'}}><ProductComponent size="small" carouselItemImage={images.productImage1} productImage={images.productImage1}></ProductComponent><ProductComponent size="small" carouselItemImage={images.productImage1} productImage={images.productImage1}></ProductComponent></View>
        //         </View>
        //     );
        // }

        const thumbnails = item.snippet.thumbnails;
        const imageUrl = thumbnails.high.url;
        
        const videoId = bigTitle != "LL2" ? item.snippet.resourceId.videoId : item.id.videoId;
        const playlistId = item.snippet.playlistId;
        const releasedAt = item.snippet.publishedAt;
        const title = item.snippet.title;
        const description = item.snippet.description;

        if(bigTitle == "MUSIC VIDEOS") {
            var titleArr = title.split('(');
            var videoTitle = titleArr[0];
            var tmpArr1 = titleArr[1];
            if(tmpArr1 == 'undefined' || tmpArr1.length > 1) {
                var tmpArr2 = tmpArr1.split('@_');
            }
            if(tmpArr2.length > 1){
                var tmpArr3 = tmpArr2[1].split('_');
                var author = tmpArr3[0];
            }else{
                var author = '';
            }
        }else{
            var videoTitle = title;
            var author = ""
        }
        

        return (
            <View style={styles.itemContainer}>
                {!product ? <ItemComponent carouselItemImage={imageUrl} itemTitle={videoTitle} itemSubTitle={author} carouselItemPlayImage={images.playIcon1} releasedAt={releasedAt} playlistId={playlistId} videoId={videoId} title={title} description={description} key={item.id}  navigation={this.props.navigation}></ItemComponent> : <View style={{flexDirection:'row'}}><ProductComponent size="small" carouselItemImage={images.productImage1} productImage={images.productImage1}></ProductComponent><ProductComponent size="small" carouselItemImage={images.productImage1} productImage={images.productImage1}></ProductComponent></View>}
            </View>
        );
    } 

    render(){
        const bigTitle = this.props.bigTitle;
        const product = this.props.product;
        const { width: viewportWidth } = Dimensions.get('window');

        return (
            <View style={styles.carouselContainer}>
                <View style={styles.title}>
                    <Text style={styles.bigTitle}>{bigTitle}</Text>
                    {
                        bigTitle == "MUSIC VIDEOS" ? <Text style={styles.viewAll} onPress={() => {this.props.navigation.navigate("Music")}}>View All</Text> : bigTitle == "LL2" ? <Text style={styles.viewAll} onPress={() => {this.props.navigation.navigate("Catalog")}}>View All</Text> : <Text style={styles.viewAll} onPress={() => {this.props.navigation.navigate("Interview")}}>View All</Text>
                    }
                </View>

                <Carousel
                  ref={(c) => { this._carousel = c; }}
                  data={this.state.entries}
                  renderItem={this._renderItem}
                  sliderWidth={viewportWidth}
                  itemWidth={viewportWidth - 50}
                />
            </View>
        );
    }
}

export default CarouselComponent;

const styles = StyleSheet.create({
    carouselContainer: {
        borderBottomColor: "#CCC",
        borderBottomWidth: 0.5,
        // marginTop: '2%',
        marginTop: hp('1%'),
        marginRight: '8%'
    },
    itemContainer: {
        // marginTop: '5%',
        marginTop: hp('1%'),
    },
        title: {
            flexDirection: 'row',
            marginBottom: '1%'
        },
        bigTitle: {
            flex: 1,
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: '5%'
        },
        viewAll: {
            flex: 1,
            fontSize: 18,
            textAlign: 'right',
            color: "#7f7f7f"
        },
        carouselItemImage: {
            width: '100%',
            height: 220
        },
        itemTitle: {
            color: "#fff",
            fontSize: 20,
            fontWeight: 'bold',
            position: 'absolute',
            left: '5%',
            // top: '6%'
            // top: hp('3%')
        },
        itemSubTitle: {
            color: "#FAFC00",
            fontSize: 13,
            fontWeight: 'bold',
            position: 'absolute',
            left: '5%',
            // top: '18%'
        },
        carouselItemPlayImage: {
        
        }
        
});

// As i have heard of, react's require() only uses static url not variables, that means that you have to do require('/path/file'),

const images = {
    carouselImage1: require('../../images/carousel1.png'),
    carouselImage2: require('../../images/carousel2.png'),
    playIcon1: require('../../images/playIcon1.png'),
    productImage1: require('../../images/productImage1.png'),
};