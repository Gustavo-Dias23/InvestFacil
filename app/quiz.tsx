import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; // Importando do Firebase

// --- Dados do Quiz (sem alterações) ---
const questions = [
  {
    question: 'Qual é o seu principal objetivo ao investir?',
    options: [
      { text: 'Preservar meu patrimônio, mesmo que o retorno seja menor.', value: 1 },
      { text: 'Aumentar meu capital, aceitando um pouco de risco.', value: 2 },
      { text: 'Maximizar os lucros, mesmo que isso envolva mais risco.', value: 3 },
    ],
  },
  {
    question: 'Se seus investimentos caíssem 20% em um mês, o que você faria?',
    options: [
      { text: 'Venderia tudo para não perder mais.', value: 1 },
      { text: 'Manteria a posição, mas ficaria muito preocupado.', value: 2 },
      { text: 'Compraria mais, pois os preços estão baixos.', value: 3 },
    ],
  },
  {
    question: 'Por quanto tempo você pretende manter seus investimentos?',
    options: [
      { text: 'Menos de 2 anos.', value: 1 },
      { text: 'Entre 2 e 5 anos.', value: 2 },
      { text: 'Mais de 5 anos.', value: 3 },
    ],
  },
];
// --------------------

export default function QuizScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const router = useRouter();

  const handleAnswer = (value: number) => {
    const newTotalScore = totalScore + value;
    setTotalScore(newTotalScore);

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      // Quiz finalizado
      calculateProfile(newTotalScore);
    }
  };

  const calculateProfile = async (finalScore: number) => {
    setLoading(true);
    let userProfile = 'Conservador';
    if (finalScore >= 5 && finalScore <= 7) {
      userProfile = 'Moderado';
    } else if (finalScore >= 8) {
      userProfile = 'Agressivo';
    }

    // Pega o usuário atualmente logado
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erro", "Nenhum usuário autenticado encontrado. Por favor, faça login novamente.");
      setLoading(false);
      router.replace('/');
      return;
    }

    try {
      // Cria uma referência para um novo documento na coleção 'profiles'
      // O ID do documento será o mesmo UID (ID único) do usuário no Firebase Auth
      const profileRef = doc(db, 'profiles', user.uid);
      
      // Salva o perfil no Firestore
      await setDoc(profileRef, {
        profileName: userProfile,
        score: finalScore,
        createdAt: new Date(), // Adiciona um timestamp de quando o perfil foi criado
        userId: user.uid,
      });

      // A navegação agora é tratada pelo _layout.tsx, que vai detectar a mudança
      // no 'profileExists' e redirecionar para /portfolio.
      // Podemos forçar uma navegação aqui também para garantir.
      router.replace({ pathname: '/portfolio' });

    } catch (error) {
      console.error("Erro ao salvar o perfil no Firestore", error);
      Alert.alert("Erro", "Não foi possível salvar seu perfil. Tente novamente.");
      setLoading(false);
    }
  };
    
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 20, fontSize: 18 }}>Salvando seu perfil...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.progressText}>
        Pergunta {currentQuestionIndex + 1} de {questions.length}
      </Text>
      <Text style={styles.questionText}>{currentQuestion.question}</Text>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <Pressable 
            key={index} 
            style={styles.optionButton} 
            onPress={() => handleAnswer(option.value)}
          >
            <Text style={styles.optionText}>{option.text}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// Estilos (mantidos, mas adicionei o texto de loading)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  progressText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  optionText: {
    fontSize: 18,
    textAlign: 'center',
  },
});