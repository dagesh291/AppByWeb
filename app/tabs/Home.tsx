// import React, { useState } from "react";
// import { View, StyleSheet, TextInput, Button, Alert,Text,ActivityIndicator  } from "react-native";
// import { WebView } from "react-native-webview";

// export default function Index() {
//   const [url, setUrl] = useState("");
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const loadUrl = () => {
//     if (input) {
//       setLoading(true);
//        const formattedUrl = input.startsWith("http")
//         ? input : `https://${input}`;
//         setUrl(formattedUrl);
//         setTimeout(() => {
//       setLoading(false);
//     }, 2000);
//     }else{
//       Alert.alert("Please Enter any Link");
//       return;
//     }
//   };

//   return (
//      <View style={styles.container}>
//       <Text style={styles.infoText}>You can explore any website by enter the url here </Text>
      
//        <View style={styles.TopHeading}>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter website URL"
//           value={input}
//           onChangeText={setInput}
//         />
//         {loading ? (
//   <ActivityIndicator size="large" color="#0077b6" />
// ) : (
//   <Button title="Search" onPress={loadUrl} />
// )}
//       </View>

//        <WebView source={{ uri: url }} style={styles.webview} />
//     </View>
//    );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // marginTop:50,
//     // backgroundColor:"#bde0fe"
//   },
//   TopHeading: {
//     flexDirection: "row",
//     padding: 10,
//    },
//   input: {
//     flex: 2,
//     borderWidth: 1,
//     marginRight: 10,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
//   webview: {
//     flex: 1,
//   }, 
//   infoText: {
//     fontSize: 16,
//     color: "#333",
//     textAlign: "center",
//     marginVertical: 2,
//    },
// });

import React, { useState ,useEffect  } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from '@react-native-async-storage/async-storage';
 import { useRouter } from "expo-router";
 import { NavigationAction } from "@react-navigation/native";
import Index from "../Index";
export default function Home() {
  const [url, setUrl] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ismainpage , Setismainpage] = useState(false);
  const router = useRouter();

useEffect(() => {
  if (url) {
    router.replace("/Index"); 
  }
}, [url]);

useEffect(() => {
  const loadSavedUrl = async () => {
    try {
      const savedUrl = await AsyncStorage.getItem("LAST_URL");

      if (savedUrl) {
        setUrl(savedUrl);
        setInput(savedUrl);
        Setismainpage(true);
      }
    } catch (e) {
      console.log("Error loading URL:", e);
    }
  };

  loadSavedUrl();
}, []);

  const loadUrl = async () => {
    if (input) {
      setLoading(true);
      const formattedUrl = input.startsWith("http") ? input : `https://${input}`;
      
       try {
       await AsyncStorage.setItem("LAST_URL", formattedUrl);
       console.log("URL:", url);
    } catch (e) {
      console.log("Error saving URL:", e);
    }finally{
      setUrl(formattedUrl);
    }
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } else {
      Alert.alert("Please Enter any Link");
      return;
    }
  };

  return (
      <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

       <View style={styles.urlBarWrapper}>
        <View style={styles.urlBar}>
          <Text style={styles.lockIcon}>🔒</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a URL or search..."
            placeholderTextColor="#9ca3af"
            value={input}
            onChangeText={setInput}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
          {loading ? (
            <ActivityIndicator size="small" color="#3b82f6" />
          ) : (
            <TouchableOpacity style={styles.goBtn} onPress={loadUrl}>
              <Text style={styles.goBtnText}>Search</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
     </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.5,
  },

  urlBarWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
  },
  urlBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  lockIcon: {
    fontSize: 13,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    padding: 0,
    margin: 0,
  },
  goBtn: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  goBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
  },

  webview: {
    flex: 1,
  },
});