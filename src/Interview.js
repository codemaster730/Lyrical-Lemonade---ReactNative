import React, { useState, useEffect } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { SimpleAnimation } from 'react-native-simple-animations';
import SidebarComponent from './components/SidebarComponent';
import CarouselComponent from './components/CarouselComponent';
import ItemComponent from './components/ItemComponent';
import { StackView } from 'react-navigation-stack';
import SmallItemComponent from './components/SmallItemComponent';
import ImageOverlay from 'react-native-image-overlay';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import Carousel from 'react-native-snap-carousel';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {GET_ALL_MUSICS, GET_ALL_INTERVIEWS, GET_ALL_LL2} from './constants/constants';
import Swipeable from 'react-native-gesture-handler/Swipeable';

// You can then use your `FadeInView` in place of a `View` in your components:
class Interview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSidebar: false,
      entries: []
    }
  }

  componentDidMount() {
    this._getInterviews(50);
  }

  async _getInterviews(param) {
    maxResults = ""+param+"";
    // const response = await fetch("https://www.googleapis.com/youtube/v3/playlistItems?playlistId=PLfvpqdsXvlf5PDuQtD7q34IiW8elYLOBO&part=snippet,id&maxResults="+maxResults+"&key=AIzaSyDatqaJO9Q6EdeJXPJ7whIE1Kbya3AeFN8");
    // const json = await response.json();
    const response = await fetch(GET_ALL_INTERVIEWS);
    const json = await response.json();
    this.setState({"entries" : json.data});
  }

  _renderItem = ({item, index}) => {
    
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
            <ItemComponent carouselItemImage={imageUrl} itemTitle={title} itemSubTitle="" carouselItemPlayImage={images.sItemPlayImage} releasedAt={releasedAt} playlistId={playlistId} videoId={videoId} title={title} description={description} key={item._id}  navigation={this.props.navigation}></ItemComponent>
        </View>
    );
  }  

  _animationView() {
    return (
      <SimpleAnimation delay={0} duration={1000} direction="right" style={{flex: 4}}>
        <SidebarComponent navigation={this.props.navigation}  pageName="Interview" hideAgain={() => this._hideSidebar()}></SidebarComponent>
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

  onSwipeRight(gestureState) {
    this.setState(prev => ({
      isSidebar: true
    }));
  }

  onSwipeLeft(gestureState) {
    this.setState(prev => ({
      isSidebar: false
    }));
  }

  renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <View>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}>
          Archive
        </Animated.Text>
      </View>
    );
  };

  render(){
    const smallInterviewsList = this.state.entries;
    const isSidebar = this.state.isSidebar;
    const { width: viewportWidth } = Dimensions.get('window');
    
    const additionalStyle = isSidebar ? StyleSheet.create({
      sidebarStyle: {
        // opacity: 0.3
      }
    }) : StyleSheet.create({
      sidebarStyle: {
        opacity: 1
      }
    });

    const smallInterviews = smallInterviewsList.map(item => {
      // const thumbnails = item.snippet.thumbnails;
      // const imageUrl = thumbnails.default.url;
      // const videoId = item.snippet.resourceId.videoId;
      // const playlistId = item.snippet.playlistId;
      // const releasedAt = item.snippet.publishedAt;
      // const title = item.snippet.title;
      // const description = item.snippet.description;
      const title = item.title;
      const imageUrl = item.image;
      const releasedAt = item.interview_release;
      const videoId = item.youtube_url;
      const description = item.description;
      const playlistId = "";

      var videoTitle = title;
      var author = "";

      return (
        <SmallItemComponent releasedAt={releasedAt} playlistId={playlistId} videoId={videoId} title={title} description={description} navigation={this.props.navigation} sitemTitle={title} sitemSubTitle={releasedAt} smallItemImage={imageUrl} sItemPlayImage={images.sItemPlayImage} key={item.id}></SmallItemComponent>
      );
    });

    return (
      <View style={styles.container}>
        {isSidebar ? this._animationView() : null}
          <View style={[styles.contentContainer, additionalStyle.sidebarStyle]}>
          {/* <GestureRecognizer
            // onSwipeLeft={(state) => this.onSwipeLeft(state)}
            onSwipeRight={(state) => this.onSwipeRight(state)}
            onSwipeLeft={(state) => this.onSwipeLeft(state)}
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
                <Text style={styles.homeLogoText}>INTERVIEWS</Text>
              </View>
              <View style={styles.tvIcon}>
                <TouchableOpacity>
                  <Image resizeMode="contain" style={styles.tvIconImage} source={require('../images/logo.png')} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bodyContainer}>
              <ScrollView ref={ref => {this.scrollView = ref}}
              >
                <View style={styles.carouselContainer}>
                  <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.state.entries}
                    renderItem={this._renderItem}
                    sliderWidth={viewportWidth}
                    itemWidth={viewportWidth -50}
                  />
                </View>
                <View style={styles.smallItemContainer}>
                  {
                    smallInterviews
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

export default Interview;

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
          width: 25,
          height: 25
        },
      homeLogo: {
        flex: 1,
        alignItems: 'center',
        // marginTop: '17%'
        marginTop: hp('8%')
      },
      homeLogoText: {
        fontWeight: 'bold'
      },

      tvIcon: {
        flex: 1,
        alignItems: 'flex-end',
        // marginTop: '18%'
        marginTop: hp('8%')
      },

      bodyContainer: {
        flex: 7,
        paddingTop: hp('2%')
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
          carouselContainer: {
            // borderBottomColor: "#CCC",
            // borderBottomWidth: 0.5,
        },
        itemContainer: {
          
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
            
            },
            smallItemContainer: {
              marginLeft: '5%',
              marginRight: '5%',
              // backgroundColor: '#f00'
            }
});


const images = {
    carouselImage1: require('../images/carousel1.png'),
    carouselImage2: require('../images/carousel2.png'),
    playIcon1: require('../images/playIcon1.png'),
    productImage1: require('../images/productImage1.png'),
    smallItemImage: require('../images/smallItemImage1.png'),
    sItemPlayImage: require('../images/playIcon2.png'),
};