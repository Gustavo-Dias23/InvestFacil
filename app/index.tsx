import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    // 1. Log para ver se a função começou
    console.log('--- Iniciando handleLogin ---');
    console.log('Email digitado:', email);
    console.log('Senha digitada:', password);

    const userValido = 'aluno@fiap.com.br';
    const senhaValida = '12345';

    if (email.toLowerCase() === userValido && password === senhaValida) {
      // 2. Log para login bem-sucedido
      console.log('Credenciais válidas! Tentando salvar no AsyncStorage e navegar...');
      
      try {
        // Navega PRIMEIRO para dar feedback rápido ao usuário
        router.replace('/quiz');
        
        // Depois, salva a sessão. Isso evita que o app trave esperando.
        await AsyncStorage.setItem('user_token', 'seu-token-de-autenticacao');

        // 3. Log para sucesso no AsyncStorage
        console.log('Sessão salva com sucesso!');

      } catch (error) {
        // 4. Log para erro no AsyncStorage
        console.error('Erro ao salvar no AsyncStorage:', error);
        Alert.alert('Erro', 'Houve um problema ao salvar sua sessão.');
      }
    } else {
      // 5. Log para credenciais inválidas
      console.log('Credenciais inválidas. Exibindo alerta.');
      Alert.alert('Login Falhou', 'Email ou senha inválidos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>InvestFácil</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Entrar" onPress={handleLogin} />
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
});