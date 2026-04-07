 import React, { useState ,useEffect  } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");

export default function Index() {
  const [url, setUrl] = useState("");
  const [storedData, setStoredData] = useState(null);
  const [showFormData, setShowFormData] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadSavedUrl = async () => {
      try {
        const savedUrl = await AsyncStorage.getItem("LAST_URL");
        if (savedUrl) setUrl(savedUrl);
      } catch (e) { console.log("Error loading URL:", e); }
    };
    loadSavedUrl();
  }, []);

 const loadFormData = async () => {
  try {
    const data = await AsyncStorage.getItem("@form_data");
    if (data) {
      setStoredData(JSON.parse(data));
      setShowFormData(prev => !prev); // toggle panel
    } else {
      setStoredData(null);
      setShowFormData(false);
    }
  } catch (err) {
    console.log("Error loading form data:", err);
  }
};

  const RemoveUrl = async () => {
    try {
      await AsyncStorage.removeItem("LAST_URL");
      setUrl("");
      setShowFormData(false);
      router.replace("/tabs/Home");
    } catch (e) { console.log("Error removing URL:", e); }
  };

  const injectedJS = `
    (function() {
      document.addEventListener("submit", function(e) {
        try {
          e.preventDefault();
          const form = e.target;
          const formData = new FormData(form);
          let data = {};
          formData.forEach((value, key) => { data[key] = value; });
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: "form", data }));
          setTimeout(() => { form.submit(); }, 500);
        } catch (err) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: "error", message: err.message }));
        }
      }, true);
    })();
    true;
  `;

  const handleMessage = async (event:any) => {
    const message = JSON.parse(event.nativeEvent.data);
    if (message.type === "form") {
      const formData = message.data;
      try { await AsyncStorage.setItem("@form_data", JSON.stringify(formData)); } catch (err) { console.log(err); }
    }
    if (message.type === "error") console.log("Error from WebView:", message.message);
  };

  return (
    <View style={{ flex: 1,marginTop:30 }}>
      {/* Fullscreen WebView */}
      <WebView
        source={{ uri: url }}
        style={{ flex: 1 }}
        injectedJavaScript={injectedJS}
        onMessage={handleMessage}
      />

      {/* Logout button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={RemoveUrl}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
      </TouchableOpacity>

       <TouchableOpacity style={styles.Formdatabtn} onPress={loadFormData}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>FormData</Text>
      </TouchableOpacity>

       {showFormData && storedData && (
        <View style={styles.bottomPanel}>
          <ScrollView contentContainerStyle={{ padding: 10 }}>
            {Object.entries(storedData).map(([key, value]) => (
              <Text key={key} style={styles.dataText}>
                {key}: {value}
              </Text>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  logoutBtn: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#ef4444",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 10,
    zIndex: 999
  },
  Formdatabtn:{
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#468ebe",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 10,
    zIndex: 999
  },
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.2, // 20% of screen height
    backgroundColor: "#f3f4f6",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 998
  },
  dataText: {
    fontSize: 16,
    marginVertical: 3,
  },
});  