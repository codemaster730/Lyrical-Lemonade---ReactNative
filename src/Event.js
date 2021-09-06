import React, { useState, useEffect } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  Animated,
  Button,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { SimpleAnimation } from 'react-native-simple-animations';
import SidebarComponent from './components/SidebarComponent';
import CarouselComponent from './components/CarouselComponent';
import ItemComponent from './components/ItemComponent';
import { StackView } from 'react-navigation-stack';
import SmallItemComponent from './components/SmallItemComponent';
import ImageOverlay from "react-native-image-overlay";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import Carousel from 'react-native-snap-carousel';
import {GET_ALL_EVENTS, LOGIN_URL} from './constants/constants';
import Spinner from 'react-native-loading-spinner-overlay';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const moment = require('moment');

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {
    // we'll talk about the details later.
  }
});

// You can then use your `FadeInView` in place of a `View` in your components:
class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSidebar: false,
      entries: [],
      pastEntries: [],
      upcomingEntries: [],
      isPast: false,
      spinnerState: false,
      error: '',
      isUpLen: true
    }
  }

  _animationView() {
    return (
      <SimpleAnimation delay={0} duration={1000} direction="right" style={{flex: 4}}>
        <SidebarComponent navigation={this.props.navigation}  pageName="Event" hideAgain={() => this._hideSidebar()}></SidebarComponent>
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

  _renderItem = ({item, index}) => {
    const pastEntries = this.state.pastEntries;
    const upcomingEntries = this.state.upcomingEntries;
    const pELeng = pastEntries.length;
    const eLeng = upcomingEntries.length;
    const isUpLen = this.state.isUpLen;

    return (
      <View style={{ height: '100%'}}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>{item.event_title}</Text>
        </View>
        <View style={styles.carouselItem}>
            <ImageOverlay containerStyle={styles.carouselItemImage} resizeMode="contain" source={{uri: "http://93.188.162.83:4200/uploads/thumb/" + item.image}} />
        </View>
        <TouchableOpacity onPress={() => {this.props.navigation.navigate('EventShow', {
          'id' : item.organized_by
        })}}>
          {
            isUpLen ? <View style={styles.infoBtn}>
            <Text style={styles.infoText}>MORE INFO</Text>
        </View> : <View></View>
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          if(!this.state.isPast) {
            if(pastEntries.length == 0) {
              this.setState({entries: [{
                event_title : 'NO PAST EVENT!'
              }]});
              this.setState({isPast: true});
              this.setState({isUpLen: false});
            }else{
              this.setState({entries:pastEntries});
              this.setState({isPast: true});
              this.setState({isUpLen: true});
            }
          }
          if(this.state.isPast){
            if(upcomingEntries.length == 0) {
              this.setState({entries: [{
                event_title : 'NO UPCOMING EVENT!'
              }]});
              this.setState({isUpLen: false});
              this.setState({isPast: false});
            }else{
              this.setState({entries: upcomingEntries});
              this.setState({isPast: false});
              this.setState({isUpLen: true});
            }
          }
        }}>
            <Text style={styles.pastEvent}>{!this.state.isPast ? 'VIEW PAST EVENTS' : 'VIEW UPCOMING EVENTS'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  async _getEvents() {
    this.setState({spinnerState: true});
    storage.load({
        key: 'loginState',
        autoSync: true,
        syncInBackground: true,
        syncParams: {
        extraFetchOptions: {
            // blahblah
        },
        someFlag: true
        }
    })
    .then(ret => {
      var body = {
        "email" : ret.email,
        "password" : ret.password
      }
      fetch(LOGIN_URL, {
          method: "post",
          headers: {
              "Content-type" : "application/json"
          },
          body: JSON.stringify(body),
      })
      .then(res => res.json())
      .then(resJson => {
        if(resJson.success) {
          fetch(GET_ALL_EVENTS, {
              method: "GET",
              headers: {
                "Content-type" : "application/json",
                "x-access-token" : resJson.token,
              }
          })
          .then(res => res.json())
          .then(resJson => {
            var tmps = resJson.data;
            var upcoming = [];
            var past = [];
            var now = moment(new Date());
            
            tmps.map(tmp => {
              if(moment(tmp.event_date).isAfter(now)) {
                upcoming.push(tmp);
              }else{
                past.push(tmp);
              }
            });
            this.setState({spinnerState: false});
            if(upcoming.length != 0) {
              this.setState({"entries" : upcoming});
            }else{
              this.setState({"entries" : past});
              this.setState({"isPast" : true});
            }
            this.setState({"upcomingEntries" : upcoming});
            this.setState({"pastEntries" : past});
          })
          .catch(err => {
            this.setState({spinnerState: false});
            this.setState({error: JSON.stringify(err)})
          });
        }
      });
    });    
  }

  componentDidMount() {
    this._getEvents();
  }

  onSwipeRight(gestureState) {
    this.setState(prev => ({
      isSidebar: true
    }));
  }

  render(){
    const { width: viewportWidth } = Dimensions.get('window');
    const isSidebar = this.state.isSidebar;
    const upcoming = this.state.upcomingEntries;
    const past = this.state.pastEntries;
    const up_length = upcoming.length;
    const past_length = past.length;

    const error = this.state.error;
    
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
        {isSidebar ? this._animationView() : null}
        <Spinner visible={this.state.spinnerState} />
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
                <Text style={styles.homeLogoText}>Events</Text>
              </View>

              <View style={styles.tvIcon}>
                <TouchableOpacity>
                  <Image resizeMode="contain" style={styles.tvIconImage} source={require('../images/logo.png')} />
                </TouchableOpacity>
              </View>

            </View>

            <View style={styles.bodyContainer}>
                <Carousel
                  ref={(c) => { this._carousel = c; }}
                  data={this.state.entries}
                  renderItem={this._renderItem}
                  sliderWidth={viewportWidth}
                  itemWidth={viewportWidth - 50}
                />
            </View>
          </View>
          <ImageOverlay containerStyle={isSidebar ? {position: 'absolute', height: '100%', opacity: 0.7} : {position: 'absolute', height: '0%', opacity: 0.7}} resizeMode="contain" source={require("../images/blur.png")} />
          {/* </GestureRecognizer> */}
        </View>
      </View>
    );
  }
}

export default Event;

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
        flex: 7
      },
      titleGroup: {
        alignItems: 'center',
        // marginTop: hp('2%'),
        marginTop: hp('3%'),
        // height: hp('11.5%')
        height: hp('8.5%')
      },
        title: {
            fontSize: 20,
            textAlign: 'center',
            width: '70%'
        },
        subTitle1Container: {
            backgroundColor: '#000',
            borderRadius: 1,
            paddingLeft: 5,
            paddingRight: 5,
            paddingTop: 1,
            paddingBottom: 1,
            marginTop: '1.5%'
        },
        subTitle1: {
            textAlign: 'center',
            color: '#FAFC00'
        },
        subTitle2Container: {   
            backgroundColor: '#000',
            borderRadius: 1,
            paddingLeft: 5,
            paddingRight: 5,
            paddingTop: 1,
            paddingBottom: 1,
            marginTop: '1%',
            // marginBottom: '5%'   
            marginBottom: hp('1%')            
        },
        subTitle2: {
            textAlign: 'center',
            color: '#00C2FF'
        },
      btnGroup: {
        
      },
        infoBtn: {
            borderRadius: 5,
            borderWidth: 2,
            borderColor: '#000',
            backgroundColor: '#FAFC00',
            marginLeft: '10%',
            marginRight: '10%',
            marginTop: '5%',
            alignItems: 'center',
            justifyContent: 'center'
        },
        infoText: {
            fontWeight: 'bold',
            fontSize: 18,
            marginTop:'3%',
            marginBottom:'7%'
        },
        pastEvent: {
            color: '#7f7f7f',
            fontSize: 18,
            textAlign: 'center',
            marginTop: '5%'
        },
        carouselItem: {
          height: '65%'
      },
      carouselItemImage: {
          width: '100%',
          height: '100%',
          borderRadius: 5
      }
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