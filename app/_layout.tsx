import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [profileExists, setProfileExists] = useState(false);
  const [isReady, setReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Listener do Firebase que observa o estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Se o usuário está logado, define o estado do usuário
        setUser(currentUser);
        // E ENTÃO, verifica se o perfil existe no Firestore
        const profileRef = doc(db, 'profiles', currentUser.uid);
        const profileSnap = await getDoc(profileRef);
        setProfileExists(profileSnap.exists());
      } else {
        // Se o usuário fez logout, reseta ambos os estados
        setUser(null);
        setProfileExists(false);
      }
      
      // *** A CORREÇÃO ESTÁ AQUI ***
      // Só marca o app como "pronto" DEPOIS que todas as verificações (auth e perfil) foram concluídas.
      setReady(true);
    });

    // Limpa o listener para evitar vazamentos de memória
    return () => unsubscribe();
  }, []); // O array vazio garante que o listener seja configurado apenas uma vez

  useEffect(() => {
    if (!isReady) {
      // Não faz nada até que a verificação inicial esteja 100% completa
      return; 
    }

    const inApp = segments.length > 0;

    if (user) {
      // Usuário está logado
      if (profileExists) {
        // Se tem usuário E perfil, a home é o portfólio
        router.replace('/portfolio');
      } else {
        // Se tem usuário mas NÃO tem perfil, força o quiz
        router.replace('/quiz');
      }
    } else if (!user && inApp) {
      // Se não tem usuário e tenta acessar qualquer tela interna, volta para o login
      router.replace('/');
    }
  }, [isReady, user, profileExists]); // Executa essa lógica sempre que um desses estados mudar

  if (!isReady) {
    // Mostra um loading enquanto o app verifica o status pela primeira vez
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="quiz" options={{ title: 'Seu Perfil de Investidor', headerLeft: () => null, gestureEnabled: false }} />
      <Stack.Screen name="portfolio" options={{ title: 'Sua Carteira Recomendada', headerLeft: () => null, gestureEnabled: false }} />
      <Stack.Screen name="goals" options={{ title: 'Minhas Metas' }} />
      <Stack.Screen name="goal-detail" options={{ title: 'Detalhes da Meta' }} />
    </Stack>
  );
}