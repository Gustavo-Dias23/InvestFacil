import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // --- NOVA MUDANÇA 1: Estado para o tipo de erro ---
  const [errorType, setErrorType] = useState<'validation' | 'network' | null>(null);
  const router = useRouter();

  const handleAuth = async () => {
    // Limpa erros antigos ao tentar novamente
    setErrorMessage('');
    setErrorType(null);

    if (!email || !password) {
      setErrorType('validation');
      setErrorMessage('Por favor, preencha o email e a senha.');
      return;
    }
    setLoading(true);

    const performAuth = isLogin ? signInWithEmailAndPassword : createUserWithEmailAndPassword;

    try {
      await performAuth(auth, email, password);
      // Sucesso, o _layout cuidará do resto
    } catch (error: any) {
      console.error(`Erro em ${isLogin ? 'Login' : 'Cadastro'}:`, error.code);
      
      // --- NOVA MUDANÇA 2: Identifica o tipo de erro ---
      if (error.code === 'auth/network-request-failed') {
        setErrorType('network');
        setErrorMessage('Falha na conexão. Verifique sua internet e tente novamente.');
      } else {
        setErrorType('validation');
        let friendlyErrorMessage = 'Ocorreu um erro desconhecido.';
        if (isLogin) {
          if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            friendlyErrorMessage = 'Email ou senha inválidos.';
          }
        } else {
          if (error.code === 'auth/email-already-in-use') {
            friendlyErrorMessage = 'Este email já está em uso.';
          } else if (error.code === 'auth/weak-password') {
            friendlyErrorMessage = 'A senha precisa ter pelo menos 6 caracteres.';
          } else if (error.code === 'auth/invalid-email') {
            friendlyErrorMessage = 'O formato do email é inválido.';
          }
        }
        setErrorMessage(friendlyErrorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>InvestFácil</Text>
      
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrorMessage('');
          setErrorType(null);
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrorMessage('');
          setErrorType(null);
        }}
        secureTextEntry
      />

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          {/* --- NOVA MUDANÇA 3: Renderização condicional dos botões --- */}
          {errorType === 'network' ? (
            <View style={styles.buttonContainer}>
              <Button title="Tentar Novamente" onPress={handleAuth} color="#ff8c00" />
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <Button title={isLogin ? "Entrar" : "Cadastrar"} onPress={handleAuth} />
            </View>
          )}

          <Pressable onPress={() => setIsLogin(!isLogin)} style={styles.toggleButton}>
            <Text style={styles.toggleText}>
              {isLogin ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Faça login"}
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
  toggleButton: {
    marginTop: 20,
  },
  toggleText: {
    color: '#007bff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});