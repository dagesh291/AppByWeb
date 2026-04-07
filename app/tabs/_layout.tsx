import Index from "../Index";
import BottomNavigation from "../Navigation/BottomNavigation";
import DrawerNavigation from "../Navigation/DrawerNavigation";
import React, { useState ,useEffect  } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App(){
    const [ismainpage , Setismainpage] = useState(false);
    useEffect(() => {
    const loadSavedUrl = async () => {
    try {
      const savedUrl = await AsyncStorage.getItem("LAST_URL");

      if (savedUrl) {
         Setismainpage(true);
         console.log("URL:", savedUrl);
      }
    } catch (e) {
      console.log("Error loading URL:", e);
    }
  };

  loadSavedUrl();
}, []);
    return(
        <>
        {/* <DrawerNavigation/> */}
        {ismainpage ? <Index/> : <BottomNavigation/> }
        {/* <BottomNavigation/> */}
        {/* <Index/> */}
        </>
        
    )
}