import React, { useState, useEffect } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

// You can then use your `FadeInView` in place of a `View` in your components:
class SidebarComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const pageName = this.props.pageName;

    return (
      <View style={styles.sidebarContainer}>
        <TouchableWithoutFeedback  onPress={() => {
            this.props.hideAgain();
            this.props.navigation.navigate("Home");
          }}>
        <View style={pageName == 'Home' ? [styles.sidebarItemContainer, {backgroundColor: "#FAFC00"}] : styles.sidebarItemContainer}>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => {
            this.props.hideAgain();
            this.props.navigation.navigate("Home");
          }}>
            <Image
                style={styles.sidebarItemImage1}
                source={require('../../images/home.png')}
            />
          </TouchableOpacity>
        </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback  onPress={() => {
            this.props.hideAgain();
            this.props.navigation.navigate("Music");
          }}>
        <View style={pageName == 'Music' ? [styles.sidebarItemContainer, {backgroundColor: "#FAFC00"}] : styles.sidebarItemContainer}>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => {
            this.props.hideAgain();
            this.props.navigation.navigate("Music");
          }}>
            <Image
                style={styles.sidebarItemImage2}
                source={require('../../images/music.png')}
            />
          </TouchableOpacity>
        </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => {
            this.props.hideAgain();
            this.props.navigation.navigate("Interview");
          }}>
        <View style={pageName == 'Interview' ? [styles.sidebarItemContainer, {backgroundColor: "#FAFC00"}] : styles.sidebarItemContainer}>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => {
            this.props.hideAgain();
            this.props.navigation.navigate("Interview");
          }}>
            <Image
                style={styles.sidebarItemImage3}
                source={require('../../images/interview.png')}
            />
          </TouchableOpacity>
        </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => {
            this.props.hideAgain();
            this.props.navigation.navigate("BlogIndex");
          }}>
        <View style={pageName == 'BlogIndex' ? [styles.sidebarItemContainer, {backgroundColor: "#FAFC00"}] : styles.sidebarItemContainer}>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => {
            this.props.hideAgain();
            this.props.navigation.navigate("BlogIndex");
          }}>
            <Image
                style={styles.sidebarItemImage7}
                source={require('../../images/blog.png')}
            />
            {/* <Text style={{fontSize: 28}}>B</Text> */}
          </TouchableOpacity>
        </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => {
              this.props.hideAgain();
              this.props.navigation.navigate("Catalog");
            }}>
          <View style={pageName == 'Shop' ? [styles.sidebarItemContainer, {backgroundColor: "#FAFC00"}] : styles.sidebarItemContainer}>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => {
              this.props.hideAgain();
              this.props.navigation.navigate("Catalog");
            }}>
              <Image
                  style={styles.sidebarItemImage4}
                  source={require('../../images/shop.png')}
              />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => {
            this.props.hideAgain();
            this.props.navigation.navigate("Event");
          }}>
        <View style={pageName == 'Event' ? [styles.sidebarItemContainer, {backgroundColor: "#FAFC00"}] : styles.sidebarItemContainer}>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => {
            this.props.hideAgain();
            this.props.navigation.navigate("Event");
          }}>
            <Image
                style={styles.sidebarItemImage5}
                source={require('../../images/calendar.png')}
            />
          </TouchableOpacity>
        </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => {
            this.props.hideAgain();
            this.props.navigation.navigate("Profile");
          }}>
        <View style={pageName == 'Profile' ? [styles.sidebarItemContainer, {backgroundColor: "#FAFC00"}] : styles.sidebarItemContainer}>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => {
            this.props.hideAgain();
            this.props.navigation.navigate("Profile");
          }}>
            <Image
                style={styles.sidebarItemImage6}
                source={require('../../images/profile.png')}
            />
          </TouchableOpacity>
        </View>
        </TouchableWithoutFeedback>

      </View>
      
    );
  }
}

export default SidebarComponent;

const styles1 = StyleSheet.create({
  sideBack: {
    backgroundColor: '#fafc00'
  }
});

const styles = StyleSheet.create({
  sidebarContainer: {
    flex: 4,
    flexDirection: "column"
  },
    sidebarItemContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center"
    },
      sidebarItemImage1: {
        width: 22,
        height: 22,
      },
      sidebarItemImage2: {
        width: 23,
        height: 18,
      },
      sidebarItemImage3: {
        width: 16,
        height: 25,
      },
      sidebarItemImage4: {
        width: 17,
        height: 23,
      },
      sidebarItemImage5: {
        width: 22,
        height: 22,
      },
      sidebarItemImage6: {
        width: 18,
        height: 22,
      },
      sidebarItemImage7: {
        width: 22,
        height: 22
      }
});
