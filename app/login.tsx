// app/login.tsx
import { useState , useEffect} from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, token } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already signed in, go to tabs
  useEffect(() => {
    if (token) {
      router.replace('/(tabs)/Dashboard');  // or '/chat' or whatever your landing tab is
    }
  }, [token]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
      // On success, AuthContext → token is set, the layout guard will navigate
    } catch (e: any) {
      setError(e.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const dev_login = async () => {
    router.replace('/(tabs)/Dashboard');
  }
    

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back 👋</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {loading
        ? <ActivityIndicator />
        : <Button title="Log in" onPress={dev_login} />
      }
      <View style={styles.footer}>
        <Text>Don't have an account?</Text>
        <Text style={styles.link} onPress={() => router.push('/signup')}>
          Sign up
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 4,
    padding: 10, marginBottom: 15,
  },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  link: { marginLeft: 5, color: 'blue' },
});
