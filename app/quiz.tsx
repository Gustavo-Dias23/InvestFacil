import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Dados do Quiz ---
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
    // 1. A variável 'userProfile' é CRIADA aqui.
    let userProfile = 'Conservador';
    if (finalScore >= 5 && finalScore <= 7) {
      userProfile = 'Moderado';
    } else if (finalScore >= 8) {
      userProfile = 'Agressivo';
    }

    try {
      // 2. O perfil é salvo no AsyncStorage.
      await AsyncStorage.setItem('user_profile', userProfile);

      // 3. A navegação acontece usando a variável que acabamos de criar.
      router.replace({ pathname: '/portfolio', params: { profile: userProfile } });

    } catch (error) {
      console.error("Erro ao salvar o perfil", error);
    }
  };
    
  // AS LINHAS COM ERRO QUE ESTAVAM AQUI FORAM REMOVIDAS.

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