import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones já vem com o Expo

// Definindo o tipo de dado para uma Meta
interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  deadline: string;
}

export default function GoalsScreen() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      router.replace('/');
      return;
    }

    // Query para buscar as metas do usuário logado
    const q = query(collection(db, "goals"), where("userId", "==", user.uid));

    // onSnapshot cria um listener em tempo real
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userGoals: Goal[] = [];
      querySnapshot.forEach((doc) => {
        userGoals.push({ id: doc.id, ...doc.data() } as Goal);
      });
      setGoals(userGoals);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar metas: ", error);
      Alert.alert("Erro", "Não foi possível carregar suas metas.");
      setLoading(false);
    });

    // Limpa o listener ao desmontar o componente
    return () => unsubscribe();
  }, []);

  const renderGoalItem = ({ item }: { item: Goal }) => (
    <Pressable style={styles.card} onPress={() => router.push({ pathname: '/goal-detail', params: { goalId: item.id } })}>
      <View>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>
          Meta: R$ {item.targetAmount.toFixed(2)} | Prazo: {item.deadline}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#ccc" />
    </Pressable>
  );

  if (loading) {
    return <ActivityIndicator style={styles.container} size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={goals}
        renderItem={renderGoalItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Você ainda não tem metas.</Text>
                <Text style={styles.emptySubText}>Clique no botão "+" para adicionar sua primeira meta!</Text>
            </View>
        }
      />
       <Pressable style={styles.fab} onPress={() => router.push('/goal-detail')}>
        <Ionicons name="add" size={32} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  fab: { // Floating Action Button
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: '#007bff',
    borderRadius: 30,
    elevation: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50%',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  emptySubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  }
});