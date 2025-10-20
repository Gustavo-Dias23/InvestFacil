import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, setDoc, addDoc, collection, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function GoalDetailScreen() {
  const router = useRouter();
  const { goalId } = useLocalSearchParams<{ goalId?: string }>(); // Pega o ID da meta da rota, se existir
  
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (goalId) {
      setIsEditing(true);
      setLoading(true);
      const fetchGoal = async () => {
        const docRef = doc(db, 'goals', goalId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name);
          setTargetAmount(data.targetAmount.toString());
          setDeadline(data.deadline);
        } else {
          Alert.alert("Erro", "Meta não encontrada.");
          router.back();
        }
        setLoading(false);
      };
      fetchGoal();
    }
  }, [goalId]);

  const handleSave = async () => {
    if (!name || !targetAmount || !deadline) {
      Alert.alert("Campos incompletos", "Por favor, preencha todos os campos.");
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      router.replace('/');
      return;
    }

    setLoading(true);
    const goalData = {
      userId: user.uid,
      name,
      targetAmount: parseFloat(targetAmount),
      deadline,
      updatedAt: serverTimestamp()
    };

    try {
      if (isEditing && goalId) {
        // --- LÓGICA DE UPDATE ---
        const docRef = doc(db, 'goals', goalId);
        await setDoc(docRef, { ...goalData, createdAt: (await getDoc(docRef)).data()?.createdAt }, { merge: true });
      } else {
        // --- LÓGICA DE CREATE ---
        await addDoc(collection(db, 'goals'), { ...goalData, createdAt: serverTimestamp() });
      }
      router.back(); // Volta para a lista de metas
    } catch (error) {
      console.error("Erro ao salvar meta: ", error);
      Alert.alert("Erro", "Não foi possível salvar a meta.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!goalId) return;

    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja excluir esta meta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: async () => {
            setLoading(true);
            try {
              // --- LÓGICA DE DELETE ---
              await deleteDoc(doc(db, 'goals', goalId));
              router.back();
            } catch (error) {
              console.error("Erro ao excluir meta: ", error);
              Alert.alert("Erro", "Não foi possível excluir a meta.");
              setLoading(false);
            }
          } 
        }
      ]
    );
  };
  
  if (loading) {
      return <ActivityIndicator style={styles.container} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome da Meta</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ex: Viagem para o Japão" />
      
      <Text style={styles.label}>Valor Alvo</Text>
      <TextInput style={styles.input} value={targetAmount} onChangeText={setTargetAmount} placeholder="Ex: 15000" keyboardType="numeric" />
      
      <Text style={styles.label}>Prazo Final</Text>
      <TextInput style={styles.input} value={deadline} onChangeText={setDeadline} placeholder="Ex: 12/2026" />

      <View style={{marginTop: 20}}>
        <Button title={isEditing ? "Atualizar Meta" : "Salvar Meta"} onPress={handleSave} />
      </View>

      {isEditing && (
        <View style={{marginTop: 15}}>
          <Button title="Excluir Meta" color="red" onPress={handleDelete} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333'
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});