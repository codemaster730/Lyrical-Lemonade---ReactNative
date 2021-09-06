import React, { useState, useEffect } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { SimpleAnimation } from 'react-native-simple-animations';
import SidebarComponent from './components/SidebarComponent';
import CarouselComponent from './components/CarouselComponent';
import ItemComponent from './components/ItemComponent';
import { StackView } from 'react-navigation-stack';
import ImageOverlay from 'react-native-image-overlay';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';

import Spinner from 'react-native-loading-spinner-overlay';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {GET_ALL_MUSICS} from './constants/constants';

// You can then use your `FadeInView` in place of a `View` in your components:
class Music extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSidebar: false,
      videoList: [],
      videoListTmp: [],
      isBottom: false,
      param: 5,
      spinnerState: false,
      searchKey: ''
    }
  }

  componentDidMount() {
    this._getVideos(5);
  }

  async _getVideos(param) {
    if(this.state.param <= 55) {
      this.setState({spinnerState: true});
      maxResults = ""+param+"";
      // const response = await fetch("https://www.googleapis.com/youtube/v3/playlistItems?playlistId=PLfvpqdsXvlf4vqsRWglvSPplpKkEsBI7E&part=snippet,id&maxResults="+maxResults+"&key=AIzaSyDatqaJO9Q6EdeJXPJ7whIE1Kbya3AeFN8");
      const response = await fetch(GET_ALL_MUSICS + "?limit=" + maxResults);
      const json = await response.json();
      // this.setState({"entries1" : json.data});
      // this.setState({"entriesTmp1" : json.data});
      
      // const json = await response.json();
      this.setState({spinnerState: false});
      this.setState({"videoList" : json.data});
      this.setState({"videoListTmp" : json.data});
      this.setState(prev => ({param: (prev.param + 5)}));
    }
  }

  _animationView() {
    return (
      <SimpleAnimation delay={0} duration={1000} direction="right" style={{flex: 4}}>
        <SidebarComponent navigation={this.props.navigation}  pageName="Music" hideAgain={() => this._hideSidebar()}></SidebarComponent>
      </SimpleAnimation>
    );
  }

  _showSidebar() {
    this.setState(prev => ({
      isSidebar: true
    }));
  }

  _hideSidebar() {
    this.setState(prev => ({
      isSidebar: false
    }));
  }

  _searchFunc(search) {
    var videoList = this.state.videoListTmp;
    var videoListTmp = this.state.videoListTmp;
    var videoTmp = [];
    videoList.map(item => {
      const videoTitle = item.title;
      var str = videoTitle;
      var n = str.includes(search);
      if(n) {
        videoTmp.push(item);
      }
    });
    if(search != '') {
      this.setState({videoList: videoTmp});
    }else{
      this.setState({videoList: videoListTmp});
    }
    this.setState({searchKey: search});
  }

  _backspace(e) {
    var search = this.state.searchKey;
    if (e.keyCode === 8) {
      this._searchFunc(search);
    }
  }

  onSwipeRight(gestureState) {
    this.setState(prev => ({
      isSidebar: true
    }));
  }

  render(){
    const isSidebar = this.state.isSidebar;
    const searchKey = this.state.searchKey;
    const videoList = this.state.videoList;
    var count = this.state.param;
    const videos = videoList.map(item => {
      const title = item.title;
    
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

    const playlistId = "";

    const imageUrl = item.image;
    const releasedAt = item.music_release;
    const videoId = item.youtube_url;
    const description = item.description;

      return <ItemComponent carouselItemImage={imageUrl} itemTitle={videoTitle} itemSubTitle={author} carouselItemPlayImage={images.playIcon1} releasedAt={releasedAt} playlistId={playlistId} videoId={videoId} title={title} description={description} key={item.id}  navigation={this.props.navigation}></ItemComponent>;
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
        <Spinner
            visible={this.state.spinnerState}
        />
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
                <Text style={styles.homeLogoText}>MUSIC VIDEOS</Text>
              </View>

              <View style={styles.tvIcon}>
                <TouchableOpacity>
                  <Image resizeMode="contain" style={styles.tvIconImage} source={require('../images/logo.png')} />
                </TouchableOpacity>
              </View>

            </View>

            <View style={styles.bodyContainer}>
              <ScrollView onScroll={(e) => {
                let paddingToBottom = 10;
                paddingToBottom += e.nativeEvent.layoutMeasurement.height;
                if(e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
                  this._getVideos(count);
                }
              }}>      
                <View style={styles.searchContainer}>
                  <View style={styles.searchBar}>
                    <View style={styles.searchIcon}>
                      <Image resizeMode="contain" style={styles.searchIconImage} source={require('../images/searchIcon.png')} />
                    </View>
                    <View style={styles.searchInput}>
                      <TextInput placeholder="Search" placeholderTextColor="#707070" style={{color: '#000'}} onChangeText={ text => this._searchFunc(text)} value={searchKey} onKeyDown={e => this._backspace(e)}/>
                    </View>
                  </View>
                </View>            
                {
                  videos
                }
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

export default Music;

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
            width: 25,
            height: 25
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
        // backgroundColor: "green"
      },
        searchBar: {
          backgroundColor: "#F6F6F7",
          flexDirection: "row",
          height: 35,
          borderRadius: 5,
          marginTop: '6%'
        },
          searchIcon: {
            flex: 1,
            alignItems: 'center',
            marginTop: 10
          },
            searchIconImage: {
              width: 13,
              height: 13
            },
          searchInput: {
            flex: 8,
            marginLeft: '36%',
            marginTop: 8
          },
});


const images = {
    carouselImage1: require('../images/carousel1.png'),
    carouselImage2: require('../images/carousel2.png'),
    playIcon1: require('../images/playIcon1.png'),
    productImage1: require('../images/productImage1.png'),
};