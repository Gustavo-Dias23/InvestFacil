import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const [isReady, setReady] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [profileExists, setProfileExists] = useState(false); // Novo estado para o perfil
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('user_token');
        const profile = await AsyncStorage.getItem('user_profile'); // Verifica também o perfil

        if (token) {
          setAuthenticated(true);
        }
        if (profile) {
          setProfileExists(true);
        }
      } catch (error) {
        console.error("Erro ao verificar status de autenticação", error);
      } finally {
        setReady(true);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inApp = segments.length > 0; // Verifica se estamos fora da tela inicial (index)

    if (isAuthenticated) {
      if (profileExists) {
        // Se tem token E perfil, a home é o portfólio
        router.replace('/portfolio');
      } else {
        // Se tem token mas NÃO tem perfil, força o quiz
        router.replace('/quiz');
      }
    } else if (!isAuthenticated && inApp) {
      // Se não tem token e tenta acessar qualquer tela, volta pro login
      router.replace('/');
    }
  }, [isReady, isAuthenticated, profileExists]);

  if (!isReady) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="quiz" options={{ title: 'Seu Perfil de Investidor', headerLeft: () => null, gestureEnabled: false }} />
      <Stack.Screen name="portfolio" options={{ title: 'Sua Carteira Recomendada', headerLeft: () => null, gestureEnabled: false }} />
    </Stack>
  );
}