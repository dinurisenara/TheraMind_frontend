import { Tabs } from "expo-router";
import { Button } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';

export default function RootLayout() {
    const { signOut } = useAuth();
  const router = useRouter();
  const logoutButton = () => (
    <Button
      title="Log Out"
      onPress={async () => {
        await signOut();
        router.replace('/login');
      }}
    />
  );
  return(
  <Tabs >
    
    <Tabs.Screen name="Dashboard" options={{ title: "Dashboard" }} />
    <Tabs.Screen name="Chat" options={{ title: "Chat" }} />
    <Tabs.Screen name="Profile" options={{ title: "Profile" ,headerRight: logoutButton}} />
   
  </Tabs>
  )
}
