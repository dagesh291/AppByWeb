import React, { useState ,useEffect  } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import * as Print from 'expo-print';

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
    //const data = await AsyncStorage.getItem("LAST_URL");
    if (data) {
      setStoredData(JSON.parse(data));
      setShowFormData(prev => !prev); 
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

    console.log("✅ Injected JS Loaded");

     document.addEventListener("submit", function(e) {
      try {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        let data = {};

        formData.forEach((value, key) => {
          data[key] = value;
        });

        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: "form",
          data: data
        }));

        setTimeout(() => {
          form.submit();
        }, 500);

      } catch (err) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: "error",
          message: err.message
        }));
      }
    }, true);

     let isPrinting = false;

  // Capture PRINT button click (IMPORTANT)
  document.addEventListener("click", function(e) {
    const btn = e.target.closest("button");

    if (btn && btn.innerText.toLowerCase().includes("print")) {
      e.preventDefault();

      if (isPrinting) return;
      isPrinting = true;

      try {
        console.log("PRINT BUTTON CLICKED");

         const table = document.querySelector("table");

         let clone = table.cloneNode(true);

        // ❌ Remove checkbox column
        clone.querySelectorAll("th:first-child, td:first-child").forEach(el => el.remove());

        // ❌ Remove icons
        clone.querySelectorAll("i, svg").forEach(el => el.remove());

        // 👉 Get ONLY selected rows (orange/highlight)
        let rows = clone.querySelectorAll("tbody tr");
        rows.forEach(row => {
          if (!row.classList.contains("highlight-row")) {
            row.remove();
          }
        });

         const html = \`
          <html>
            <head>
              <style>
                body { font-family: Arial; padding: 10px; }
                table { border-collapse: collapse; width: 100%; }
                th, td {
                  border: 1px solid #000;
                  padding: 8px;
                  text-align: left;
                  font-size: 12px;
                }
                th { background: #eee; }
              </style>
            </head>
            <body>
              \${clone.outerHTML}
            </body>
          </html>
        \`;

        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: "PRINT",
          html: html
        }));

      } catch (err) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: "error",
          message: err.message
        }));
      }

      setTimeout(() => { isPrinting = false; }, 2000);
    }
  });
 
  })();++
  true;
`;

  const handleMessage = async (event: any) => {
  console.log("📩 Message:", event.nativeEvent.data);

  try {
    
      const message = JSON.parse(event.nativeEvent.data);

    if (message.type === "PRINT") {
      console.log("🖨️ PRINT RECEIVED");

      await Print.printAsync({
        html: message.html,
      });

      return;
    }

     if (message.type === "form") {
      await AsyncStorage.setItem("@form_data", JSON.stringify(message.data));
    }

     if (message.type === "error") {
      console.log("WebView Error:", message.message);
    }

  } catch (err) {
    console.log("Invalid message:", err);
  }
};

  return (
    <View style={{ flex: 1 , marginTop:30}}>
       
      <WebView
  source={{ uri: url }}
  style={{ flex: 1 }}
  injectedJavaScript={injectedJS}
  onMessage={handleMessage}
  javaScriptEnabled={true}
  domStorageEnabled={true}
/>

       {/* <TouchableOpacity style={styles.logoutBtn} onPress={RemoveUrl}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
      </TouchableOpacity>

       <TouchableOpacity style={styles.Formdatabtn} onPress={loadFormData}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>FormData</Text>
      </TouchableOpacity> */}

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
    bottom: 450,
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
    bottom: 500,
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
    height: height * 0.2,  
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