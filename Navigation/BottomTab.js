import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from '../Screen/Home';
import Search from '../Screen/Search';
import Product from '../Screen/Product';
import Cart from '../Screen/Cart';
import Profile from '../Screen/Profile';

const Tab = createBottomTabNavigator();

const icons ={
    Home: 'home',
    Search:'search',
    Product:'grid',
    Profile:'person',
    Cart:'cart',
};

export default function BOttomTabNavigator(){

return(
    <Tab.Navigator
    screenOptions={({route}) =>({
        headerShown: false,

        tabBarActiveTintColor: 'yellow',
        tabBarInactiveTintColor:'grey',
        tabBarActiveBackgroundColor:'#100B1D',

        tabBarStyle:{
            height:50,
             paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F2D8AE',
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },

        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={icons[route.name]}
            size={size}
            color={color}
          />
        ),
      })}


    >
        <Tab.Screen name='Home' component={Home}/>
         <Tab.Screen name='Search' component={Search}/>
          <Tab.Screen name='Product' component={Product}/>
           <Tab.Screen name='Cart' component={Cart}/>
         <Tab.Screen name='Profile' component={Profile}/>
         




    </Tab.Navigator>
)
}
        




