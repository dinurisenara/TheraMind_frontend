// app/signup.tsx
import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();
  const { signUp, token } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already signed in, go to main app
  if (token) {
    router.replace('/(tabs)/Dashboard');
    return null;
  }

  const handleSignup = async () => {
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signUp(email.trim(), password);
      // on success, AuthContext will have token ⇒ guarded layout takes over
    } catch (e: any) {
      setError(e.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />
      {loading
        ? <ActivityIndicator />
        : <Button title="Sign up" onPress={handleSignup} />
      }
      <View style={styles.footer}>
        <Text>Already have an account?</Text>
        <Text style={styles.link} onPress={() => router.push('/login')}>
          Log in
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
