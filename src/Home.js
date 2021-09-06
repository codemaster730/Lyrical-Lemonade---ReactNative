import React, { useState, useEffect } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  StatusBar
} from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import ItemComponent from './components/ItemComponent';
import { SimpleAnimation } from 'react-native-simple-animations';
import SidebarComponent from './components/SidebarComponent';
import CarouselComponent from './components/CarouselComponent';
import Carousel from 'react-native-snap-carousel';
import { StackView } from 'react-navigation-stack';
import ImageOverlay from 'react-native-image-overlay';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';

import { initialMode } from 'react-native-dark-mode';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import {GET_ALL_MUSICS, GET_ALL_INTERVIEWS, GET_ALL_LL2} from './constants/constants';


// You can then use your `FadeInView` in place of a `View` in your components:
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSidebar: false,
      entries1: [],
      entriesTmp1: [],
      entries2: [],
      entriesTmp2: [],
      entries3: [],
      entriesTmp3: [],
      searchKey: '',
      isNull1: false,
      isNull2: false,
      isNull3: false,
    }
  }

  _searchFunc(search) {
    this.setState({searchKey: search});
    var videoList1 = this.state.entriesTmp1;
    var videoListTmp1 = this.state.entriesTmp1;
    var videoTmp1 = [];
    videoList1.map(item => {
      const videoTitle = item.title;
      var str = videoTitle;
      var n = str.includes(search);
      if(n) {
        videoTmp1.push(item);
      }
    });
    if(videoTmp1.length == 0) {
      this.setState({isNull1 : true});
    }
    if(search != '') {
      this.setState({isNull1 : false});
      this.setState({entries1: videoTmp1});
    }else{
      this.setState({isNull1 : false});
      this.setState({entries1: videoListTmp1});
    }
    
    var videoList2 = this.state.entriesTmp2;
    var videoListTmp2 = this.state.entriesTmp2;
    var videoTmp2 = [];
    videoList2.map(item => {
      const videoTitle = item.title;
      var str = videoTitle;
      var n = str.includes(search);
      if(n) {
        videoTmp2.push(item);
      }
    });
    if(videoTmp2.length == 0) {
      this.setState({isNull2 : true});
    }
    if(search != '') {
      this.setState({isNull2 : false});
      this.setState({entries2: videoTmp2});
    }else{
      this.setState({isNull2 : false});
      this.setState({entries2: videoListTmp2});
    }
    
    var videoList3 = this.state.entriesTmp3;
    var videoListTmp3 = this.state.entriesTmp3;
    var videoTmp3 = [];
    videoList3.map(item => {
      const videoTitle = item.title;
      var str = videoTitle;
      var n = str.includes(search);
      if(n) {
        videoTmp3.push(item);
      }
    });
    if(videoTmp3.length == 0) {
      this.setState({isNull3 : true});
    }
    if(search != '') {
      this.setState({isNull3 : false});
      this.setState({entries3: videoTmp3});
    }else{
      this.setState({isNull3 : false});
      this.setState({entries3: videoListTmp3});
    }
  }

  _backspace(e) {
    var search = this.state.searchKey;
    if (e.keyCode === 8) {
      this._searchFunc(search);
    }
  }

  componentDidMount() {
    this._getVideos(50);
    this._getInterviews(50);
    this._getMerches();
  }

  async _getVideos(param) {
    maxResults = ""+param+"";
    // const response = await fetch("https://www.googleapis.com/youtube/v3/playlistItems?playlistId=PLfvpqdsXvlf4vqsRWglvSPplpKkEsBI7E&part=snippet,id&maxResults="+maxResults+"&key=AIzaSyDatqaJO9Q6EdeJXPJ7whIE1Kbya3AeFN8");
    // this.setState({"entries1" : json.items});
    // this.setState({"entriesTmp1" : json.items});
    const response = await fetch(GET_ALL_MUSICS);
    const json = await response.json();
    this.setState({"entries1" : json.data});
    this.setState({"entriesTmp1" : json.data});
  }

  async _getInterviews(param) {
    // maxResults = ""+param+"";
    // const response = await fetch("https://www.googleapis.com/youtube/v3/playlistItems?playlistId=PLfvpqdsXvlf5PDuQtD7q34IiW8elYLOBO&part=snippet,id&maxResults="+maxResults+"&key=AIzaSyDatqaJO9Q6EdeJXPJ7whIE1Kbya3AeFN8");

    // const json = await response.json();
    // this.setState({"entries2" : json.items});
    // this.setState({"entriesTmp2" : json.items});
    const response = await fetch(GET_ALL_INTERVIEWS);
    const json = await response.json();
    this.setState({"entries2" : json.data});
    this.setState({"entriesTmp2" : json.data});
  }

  async _getMerches() {
    // const response = await fetch("https://www.googleapis.com/youtube/v3/search?key=AIzaSyDatqaJO9Q6EdeJXPJ7whIE1Kbya3AeFN8&channelId=UCMreYZfbzsP4eHgJMlpqRYQ&part=snippet,id&order=date&maxResults=50");
    // const json = await response.json();
    // this.setState({"entries3" : json.items});
    // this.setState({"entriesTmp3" : json.items});
    const response = await fetch(GET_ALL_LL2);
    const json = await response.json();
    this.setState({"entries3" : json.data});
    this.setState({"entriesTmp3" : json.data});
  }

  _renderItem1 = ({item, index}) => {
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

    return (
        <View style={styles.itemContainer}>
          <ItemComponent carouselItemImage={imageUrl} itemTitle={videoTitle} itemSubTitle={author} carouselItemPlayImage={images.playIcon1} releasedAt={releasedAt} playlistId={playlistId} videoId={videoId} title={title} description={description} key={item._id}  navigation={this.props.navigation}></ItemComponent>
        </View>
    );
  }

  _renderItem2 = ({item, index}) => {
    const title = item.title;
    const imageUrl = item.image;
    const releasedAt = item.interview_release;
    const videoId = item.youtube_url;
    const description = item.description;
    const playlistId = "";

    var videoTitle = title;
    var author = "";
    
    return (
        <View style={styles.itemContainer}>
          <ItemComponent carouselItemImage={imageUrl} itemTitle={videoTitle} itemSubTitle={author} carouselItemPlayImage={images.playIcon1} releasedAt={releasedAt} playlistId={playlistId} videoId={videoId} title={title} description={description} key={item._id}  navigation={this.props.navigation}></ItemComponent>
        </View>
    );
  }

  _renderItem3 = ({item, index}) => {
        const title = item.title;
        const imageUrl = item.image;
        const releasedAt = item.ll2_release;
        const videoId = item.youtube_url;
        const description = item.description;
        const playlistId = "";

        var videoTitle = title;
        var author = "";

        return (
          <View style={styles.itemContainer}>
            <ItemComponent carouselItemImage={imageUrl} itemTitle={videoTitle} itemSubTitle={author} carouselItemPlayImage={images.playIcon1} releasedAt={releasedAt} playlistId={playlistId} videoId={videoId} title={title} description={description} key={item._id}  navigation={this.props.navigation}></ItemComponent>
          </View>
        );
    }

  _animationView() {
    return (
      <SimpleAnimation delay={0} duration={1000} direction="right" style={{flex: 4}}>
        <SidebarComponent navigation={this.props.navigation} pageName="Home" hideAgain={() => this._hideSidebar()}></SidebarComponent>
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

  onSwipe(gestureName, gestureState) {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    this.setState({gestureName: gestureName});
    switch (gestureName) {
      case SWIPE_UP:
        // this.setState({backgroundColor: 'red'});
        break;
      case SWIPE_DOWN:
        // this.setState({backgroundColor: 'green'});
        break;
      case SWIPE_LEFT:
        // this.setState({backgroundColor: 'blue'});
        break;
      case SWIPE_RIGHT:
        // this.setState({backgroundColor: 'yellow'});
        break;
    }
  }

  onSwipeUp(gestureState) {
    
  }
 
  onSwipeDown(gestureState) {
    
  }
 
  onSwipeLeft(gestureState) {
    
  }

  onSwipeRight(gestureState) {
    this.setState(prev => ({
      isSidebar: true
    }));
  }

  render(){
    
    const isSidebar = this.state.isSidebar;
    const searchKey = this.state.searchKey;
    const isNull1 = this.state.isNull1;
    const isNull2 = this.state.isNull2;
    const isNull3 = this.state.isNull3;
    const { width: viewportWidth } = Dimensions.get('window');
    
    const additionalStyle = isSidebar ? StyleSheet.create({
      sidebarStyle: {
        
      }
    }) : StyleSheet.create({
      sidebarStyle: {
        opacity: 1
      }
    });

    const config = {
      detectSwipeUp : false,
      detectSwipeDown : false,
      detectSwipeLeft : false,
      detectSwipeRight : false
    }

    return (
      <View style={styles.container}>
        <StatusBar  barStyle="dark-content" translucent={true} />
        {isSidebar ? this._animationView() : null}
        <View style={[styles.contentContainer, additionalStyle.sidebarStyle]}>
        {/* <GestureRecognizer
            config = {config}
            onSwipe={(direction, state) => this.onSwipe(direction, state)}
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
                <TouchableOpacity>
                  <Image resizeMode="contain" style={styles.homeLogoImage} source={require('../images/homeLogo.png')} />
                </TouchableOpacity>
              </View>
              <View style={styles.tvIcon}>
                <TouchableOpacity>
                  <Image resizeMode="contain" style={styles.tvIconImage} source={require('../images/tvIcon.png')} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bodyContainer}>
              <ScrollView 
                // horizontal={true}
                // directionalLockEnabled={true}
              >
                <View style={styles.searchContainer}>
                  <View style={styles.searchBar}>
                    <View style={styles.searchIcon}>
                      <Image resizeMode="contain" style={styles.searchIconImage} source={require('../images/searchIcon.png')} />
                    </View>
                    <View style={styles.searchInput}>
                      <TextInput placeholder="Search" placeholderTextColor="#707070" style={{color: '#000'}} onChangeText={ text => this._searchFunc(text)} value={searchKey} onKeyDown={e => this._backspace(e)} />
                    </View>
                  </View>
                </View>
    
                <View style={styles.carouselContainer}>
          
                  <View style={styles.title}>
                      <Text style={styles.bigTitle}>MUSIC VIDEOS</Text>
                      <Text style={styles.viewAll} onPress={() => {this.props.navigation.navigate("Music")}}>View All</Text>
                  </View>
                  {
                    isNull1 ? <View style={{width: '100%', height: 240, textAlign: 'center'}}><Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', width: '100%'}}>No Videos</Text></View> : <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.state.entries1}
                    renderItem={this._renderItem1}
                    sliderWidth={viewportWidth}
                    itemWidth={viewportWidth - 50}
                  />
                  }
                </View>

                <View style={styles.carouselContainer}>
                  <View style={styles.title}>
                      <Text style={styles.bigTitle}>INTERVIEWS</Text>
                      <Text style={styles.viewAll} onPress={() => {this.props.navigation.navigate("Interview")}}>View All</Text>
                  </View>

                  {
                    isNull2 ? <View style={{width: '100%', height: 240, textAlign: 'center'}}><Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', width: '100%'}}>No Videos</Text></View> : <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.state.entries2}
                    renderItem={this._renderItem2}
                    sliderWidth={viewportWidth}
                    itemWidth={viewportWidth - 50}
                  />
                  }
                </View>

                <View style={styles.carouselContainer}>
                  <View style={styles.title}>
                      <Text style={styles.bigTitle}>LL2</Text>
                  </View>
                  {
                    isNull3 ? <View style={{width: '100%', height: 240, textAlign: 'center'}}><Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', width: '100%'}}>No Videos</Text></View> : <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.state.entries3}
                    renderItem={this._renderItem3}
                    sliderWidth={viewportWidth}
                    itemWidth={viewportWidth - 50}
                  />
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

export default Home;

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
        sidebarMenu: {
          flex: 1,
          // marginTop: '20%'
          marginTop: hp('8%')
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
      },
        searchBar: {
          backgroundColor: "#F6F6F7",
          flexDirection: "row",
          height: 35,
          borderRadius: 5,
          // marginTop: '6%',
          marginTop: hp('2%'),
          marginLeft: '5%',
          marginRight: '5%',
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

const images = {
    carouselImage1: require('../images/carousel1.png'),
    carouselImage2: require('../images/carousel2.png'),
    playIcon1: require('../images/playIcon1.png'),
    productImage1: require('../images/productImage1.png'),
};