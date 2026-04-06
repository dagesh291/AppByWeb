import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function LoaderButton(){
    const [spinloader , setspinloader] = useState(false);
    const handleSubmit = ()=>{
        setspinloader(!spinloader);
    }
    return(
        <View>
          <Button
        style={styles.button}
        onPress={handleSubmit}
        mode="contained"
        loading={spinloader}
      >
       <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}}>
          <Text>Submit</Text>  
        </View>
              </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
    marginTop: 25,
    backgroundColor: "#598dafff",
     paddingVertical: 5,
     borderRadius: 50,
     width:150,alignSelf: 'center',
    right: 20,
    elevation: 3,
  },
})