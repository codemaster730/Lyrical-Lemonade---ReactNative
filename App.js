import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Entry from './src/Entry';
import Login from './src/Login';
import SignUp from './src/SignUp';
import Route from './src/Route';
import Home from './src/Home';
import Music from './src/Music';
import Interview from './src/Interview';
import Catalog from './src/Catalog';
import Event from './src/Event';
import Profile from './src/Profile';
import Cart from './src/Cart';
import Edit from './src/Edit';
import Item from './src/Item';
import VideoPlay from './src/Video';
import Videoshow from './src/Videoshow';
import BlogIndex from './src/BlogIndex';
import BlogShow from './src/BlogShow';
import BlogFirst from './src/Blog1';
import BlogSecond from './src/Blog2';
import EventShow from './src/EventShow';
import ProductView from './src/ProductView';
import Forgot from './src/Forgot';

const MainNavigator = createStackNavigator(
  {
    Entry: {
      screen: Entry
    },
    Login: {screen: Login, navigationOptions: {
      gesturesEnabled: false,
    }},
    SignUp: {screen: SignUp, navigationOptions: {
      gesturesEnabled: false,
    }},
    Home: {
      screen: Home,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    Music: {
      screen: Music,
      navigationOptions: {
        gesturesEnabled: false,
      }
    },
    Interview: {
      screen: Interview,
      navigationOptions: {
        gesturesEnabled: false,
      }
    },
    Catalog: {
      screen: Catalog,
      navigationOptions: {
        gesturesEnabled: false,
      }
    },
    Event: {
      screen: Event,
      navigationOptions: {
        gesturesEnabled: false,
      }
    },
    Profile: {
      screen: Edit,
      navigationOptions: {
        gesturesEnabled: false,
      }
    },
    // Profile: {
    //   screen: Profile,
    //   navigationOptions: {
    //     gesturesEnabled: false,
    //   }
    // },
    Cart: {screen: Cart,
      navigationOptions: {
        gesturesEnabled: false,
      }},
    Edit: {screen: Edit,navigationOptions: {
      gesturesEnabled: false,
    }},
    Item: {screen: Item,navigationOptions: {
      gesturesEnabled: false,
    }},
    VideoPlay: {screen: VideoPlay,navigationOptions: {
      gesturesEnabled: true,
    }},
    VideoShow: {screen: Videoshow,navigationOptions: {
      gesturesEnabled: true,
    }},
    BlogIndex: {screen: BlogIndex,navigationOptions: {
      gesturesEnabled: false,
    }},
    BlogShow: {screen: BlogShow,navigationOptions: {
      gesturesEnabled: false,
    }},
    BlogFirst: {screen: BlogFirst,navigationOptions: {
      gesturesEnabled: false,
    }},
    BlogSecond: {screen: BlogSecond,navigationOptions: {
      gesturesEnabled: false,
    }},
    EventShow: {screen: EventShow,navigationOptions: {
      gesturesEnabled: false,
    }},
    ProductView: {screen: ProductView,navigationOptions: {
      gesturesEnabled: false,
    }},
    Forgot: {screen: Forgot, navigationOptions: {
      gesturesEnabled: false,
    }}
  },
  {
    headerMode: 'none',
    initialRouteName: 'Entry'
  }
);

const App = createAppContainer(MainNavigator);

export default App;
