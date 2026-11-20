import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import ShopContextProvider from "./Context/ShopContext";
import { AuthProvider } from "./Context/AuthContext";
import AuthNavigation from "./Navigation/AuthNavigation";

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ShopContextProvider>
          <NavigationContainer>
            <AuthNavigation />
          </NavigationContainer>
        </ShopContextProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

export default App;
