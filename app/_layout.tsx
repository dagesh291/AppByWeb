import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import Index from "./Index";

export default function RootLayout() {
  return (
    <>
    <ThemeProvider value={DefaultTheme}>
    <Stack>
      <Stack.Screen name="tabs" options={{headerShown:false}}/>
      <Stack.Screen name="Index" options={{ headerShown: false }}/>
     </Stack>
    </ThemeProvider>
    </>
  );
}
