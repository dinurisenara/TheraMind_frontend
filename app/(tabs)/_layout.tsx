import { Tabs } from "expo-router";

export default function RootLayout() {
  return(
  <Tabs >
    
    <Tabs.Screen name="Dashboard" options={{ title: "Dashboard" }} />
    <Tabs.Screen name="Chat" options={{ title: "Chat" }} />
    <Tabs.Screen name="Profile" options={{ title: "Profile" }} />
   
  </Tabs>
  )
}
