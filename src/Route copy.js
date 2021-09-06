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
import { SimpleAnimation } from 'react-native-simple-animations';
import SidebarComponent from './components/SidebarComponent';
import CarouselComponent from './components/CarouselComponent';
import { StackView } from 'react-navigation-stack';

// You can then use your `FadeInView` in place of a `View` in your components:
class Route extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSidebar: false
    }
  }

  _animationView() {
    return (
      <SimpleAnimation delay={0} duration={1000} direction="right" style={{flex: 4}}>
        <SidebarComponent navigation={this.props.navigation}></SidebarComponent>
      </SimpleAnimation>
    );
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
        opacity: 0.3
      }
    }) : StyleSheet.create({
      sidebarStyle: {
        opacity: 1
      }
    });

    return (
      <View style={styles.container}>
        {isSidebar ? this._animationView() : null}
        <View style={[styles.contentContainer, additionalStyle.sidebarStyle]}>
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
              <ScrollView>
                <View style={styles.searchContainer}>
                  <View style={styles.searchBar}>
                    <View style={styles.searchIcon}>
                      <Image resizeMode="contain" style={styles.searchIconImage} source={require('../images/searchIcon.png')} />
                    </View>
                    <View style={styles.searchInput}>
                      <TextInput placeholder="Search" placeholderTextColor="#707070" />
                    </View>
                  </View>
                </View>

                <CarouselComponent bigTitle="MUSIC VIDEOS"></CarouselComponent>

                <CarouselComponent bigTitle="INTERVIEWS"></CarouselComponent>

                <CarouselComponent bigTitle="MERCH" product={true}></CarouselComponent>
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Route;

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
          marginTop: '20%'
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
          marginTop: '17%'
        },
        tvIcon: {
          flex: 1,
          alignItems: 'flex-end',
          marginTop: '18%'
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
