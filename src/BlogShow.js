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
import { StackView } from 'react-navigation-stack';
import ImageOverlay from 'react-native-image-overlay';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { WebView } from 'react-native-webview';
import Spinner from 'react-native-loading-spinner-overlay';

// You can then use your `FadeInView` in place of a `View` in your components:
class BlogShow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSidebar: false,
      videoList: [],
      spinnerState: false
    }
  }

  componentDidMount() {
      
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

  render(){
    const isSidebar = this.state.isSidebar;
    
    const additionalStyle = isSidebar ? StyleSheet.create({
      sidebarStyle: {
        
      }
    }) : StyleSheet.create({
      sidebarStyle: {
        opacity: 1
      }
    });

    const link = this.props.navigation.getParam('link');

    return (
      <View style={styles.container}>
        {isSidebar ? this._animationView() : null}
        {/* <TouchableWithoutFeedback onPress={() => this._hideSidebar()}> */}
        <Spinner
            visible={this.state.spinnerState}
        />
        <View style={[styles.contentContainer, additionalStyle.sidebarStyle]}>
          <View style={styles.content}>
            

            <View style={styles.bodyContainer}>
                <WebView
                source={{uri: link}}
                onLoadStart = {() => this.setState({spinnerState: true})}
                onLoadEnd = {() => this.setState({spinnerState: false})}
                contentInset={{top: 26}}
                scrollEnabled = {true}
              />
            </View>

            <View style={styles.headerContainer}>

              <View style={styles.sidebarMenu}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                  <Image resizeMode="contain" style={styles.sidebarMenuImage} source={require('../images/arrow.png')} />
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
          </View>
        </View>
      </View>
    );
  }
}

export default BlogShow;

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
      // position: 'absolute',
      height: '100%',
      width: '100%'
    },
      headerContainer: {
        flex: 1,
        position: 'absolute',
        backgroundColor: '#fff',
        flexDirection: 'row',
        paddingLeft: '5%',
        paddingRight: '5%',
        paddingBottom: '3%',
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

      userInfo: {
        borderBottomWidth: 3,
        borderBottomColor: '#888',
        paddingBottom: '8%'
      },

      user: {
        flexDirection: 'row',
        marginTop: '8%'
      },
      userImage: {
        flex: 1
      },
      userImgContainer: {
        height: 80,
        width: 80,
        backgroundColor: '#ddd',
        borderWidth: 3,
        borderRadius: 200
      },
      userName: {
        flex: 3,
        marginTop: '5%'
      },
      userNameBig: {
        fontSize: 20,
        fontWeight: 'bold'
      },
      userNameSmall: {
        fontSize: 16,
        color: '#8f8f8f'
      },
      userTitle: {
        marginTop: '5%'
      },
      userTitleText: {
        fontSize: 38,
        fontWeight: 'bold'
      },
      userBtn: {
        flexDirection: 'row',
        marginTop: '5%'
      },
      roundBtn: {
        backgroundColor: '#A6DBFB',
        borderRadius: 50,
        justifyContent: 'center'
      },
      roundText: {
        color: '#fff',
        fontSize: 25,
        paddingBottom: '1%',
        paddingLeft: '8%',
        paddingRight: '8%',
      },
      blogContainer: {
        marginTop: '10%'
      },
      blogContent: {
        fontSize: 20,
        lineHeight: 30
      }
});
