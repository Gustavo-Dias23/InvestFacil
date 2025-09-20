import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const portfolioData = {
  Conservador: {
    title: 'Carteira Conservadora',
    description: 'Foco em segurança e baixa volatilidade para preservar seu capital.',
    assets: [
      { name: 'Tesouro Selic (LFT)', percentage: '60%', explanation: 'O ativo mais seguro do país, ideal para reserva de emergência e objetivos de curto prazo.' },
      { name: 'CDB com liquidez diária', percentage: '30%', explanation: 'Investimento seguro, com garantia do FGC e rendimento superior à poupança.' },
      { name: 'Fundos Imobiliários (FIIs)', percentage: '10%', explanation: 'Uma pequena exposição à renda variável para receber dividendos mensais com relativa segurança.' },
    ],
  },
  Moderado: {
    title: 'Carteira Moderada',
    description: 'Equilíbrio entre segurança e rentabilidade, buscando maiores ganhos com risco controlado.',
    assets: [
      { name: 'Tesouro IPCA+ (NTN-B Principal)', percentage: '30%', explanation: 'Protege seu dinheiro da inflação e oferece um ganho real no longo prazo.' },
      { name: 'Ações de empresas sólidas (Blue Chips)', percentage: '40%', explanation: 'Exposição a grandes empresas com histórico de lucro, visando valorização no longo prazo.' },
      { name: 'Fundos Multimercado', percentage: '20%', explanation: 'Gestores profissionais diversificam seus investimentos em diferentes mercados para buscar rentabilidade.' },
      { name: 'Investimentos no Exterior (ETFs)', percentage: '10%', explanation: 'Diversificação internacional em dólar para proteger sua carteira das variações do mercado brasileiro.' },
    ],
  },
  Agressivo: {
    title: 'Carteira Agressiva',
    description: 'Foco em maximizar a rentabilidade, aceitando uma maior volatilidade e riscos no curto prazo.',
    assets: [
      { name: 'Ações de Crescimento (Small Caps)', percentage: '50%', explanation: 'Empresas com alto potencial de valorização, que podem trazer grandes retornos.' },
      { name: 'Criptomoedas (Bitcoin/Ethereum)', percentage: '10%', explanation: 'Exposição a ativos digitais com altíssima volatilidade e potencial de lucro expressivo.' },
      { name: 'Fundos de Ações', percentage: '20%', explanation: 'Permite investir em um portfólio diversificado de ações escolhidas por um gestor profissional.' },
      { name: 'BDRs (Ações de empresas estrangeiras)', percentage: '20%', explanation: 'Invista em gigantes da tecnologia como Google e Apple sem precisar enviar dinheiro para o exterior.' },
    ],
  },
};

export default function PortfolioScreen() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<keyof typeof portfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const profileFromStorage = await AsyncStorage.getItem('user_profile') as keyof typeof portfolioData;
      setUserProfile(profileFromStorage);
      setIsLoading(false);
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['user_token', 'user_profile']);
    router.replace('/');
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.container} />;
  }

  if (!userProfile || !portfolioData[userProfile]) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Perfil não encontrado</Text>
        <Button title="Refazer Quiz" onPress={() => router.replace('/quiz')} />
      </View>
    );
  }

  const userPortfolio = portfolioData[userProfile];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>{userPortfolio.title}</Text>
        <Text style={styles.description}>{userPortfolio.description}</Text>
      </View>
      <Text style={styles.assetsTitle}>Composição da Carteira:</Text>
      {userPortfolio.assets.map((asset, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.assetName}>{asset.name}</Text>
            <Text style={styles.assetPercentage}>{asset.percentage}</Text>
          </View>
          <Text style={styles.assetExplanation}>{asset.explanation}</Text>
        </View>
      ))}
      <View style={styles.logoutButtonContainer}>
        <Button title="Sair" color="red" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center'
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  assetsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  assetName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  assetPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  assetExplanation: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  logoutButtonContainer: {
    marginTop: 30,
    marginBottom: 20,
    marginHorizontal: 10,
  },
});