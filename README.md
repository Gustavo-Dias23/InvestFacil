# InvestFácil - Assessor de Investimentos Virtual

Projeto desenvolvido para a Global Solution da matéria de **Mobile Development and IoT**.

Este é um aplicativo móvel, construído com React Native e Expo, que simula um assessor de investimentos virtual. O objetivo é identificar o perfil de investidor do usuário através de um quiz e, com base nisso, recomendar uma carteira de investimentos personalizada.

---

## 📋 Índice

* [Funcionalidades Principais](#-funcionalidades-principais)
* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [Pré-requisitos](#-pré-requisitos)
* [Como Executar o Projeto](#-como-executar-o-projeto)
* [Guia de Teste e Funcionalidades](#-guia-de-teste-e-funcionalidades)
* [Credenciais para Acesso](#-credenciais-para-acesso)
* [Autor](#-autor)

---

## ✨ Funcionalidades Principais

* **Fluxo de Autenticação Completo:** Sistema de login com persistência de sessão utilizando `AsyncStorage`. O aplicativo "lembra" do usuário logado.
* **Quiz de Suitability:** Questionário interativo para definir o perfil de investidor do usuário em uma de três categorias: Conservador, Moderado ou Agressivo.
* **Recomendação de Carteira:** Exibição de um portfólio de investimentos detalhado e personalizado, com explicações sobre cada ativo, de acordo com o perfil do usuário.
* **Arquitetura Moderna:** Construído com Expo Router, utilizando uma estrutura de rotas baseada em arquivos para uma navegação limpa e organizada.

---

## 🛠️ Tecnologias Utilizadas

* [React Native](https://reactnative.dev/)
* [Expo](https://expo.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [Expo Router](https://docs.expo.dev/router/introduction/) (para navegação)
* [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (para persistência de dados)

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de que você tem as seguintes ferramentas instaladas em seu ambiente de desenvolvimento:

* **Node.js** (versão LTS recomendada)
* **Git**
* **Android Studio** com um **Emulador Android** configurado e pronto para uso.

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para clonar, instalar as dependências e executar o aplicativo no emulador.

**1. Clone o Repositório**
Abra seu terminal e execute o seguinte comando:
```bash
git clone [URL_DO_SEU_REPOSITORIO_AQUI]
```

**2. Navegue até a Pasta do Projeto**
```bash
cd investFacil
```

**3. Instale as Dependências**
Execute o comando abaixo para instalar todas as bibliotecas necessárias para o projeto.
```bash
npm install
```

**4. Execute o Aplicativo**
Certifique-se de que seu emulador Android já esteja aberto e funcionando. Em seguida, execute o comando para iniciar o servidor do Expo:
```bash
npx expo start
```

**5. Abra no Emulador**
Com o servidor do Expo rodando, o terminal exibirá um menu de opções. Pressione a tecla `a` para que o aplicativo seja instalado e aberto automaticamente no emulador Android.

---

## 🧪 Guia de Teste e Funcionalidades

Para facilitar a correção, siga este roteiro para testar todas as funcionalidades implementadas.

### Credenciais para Acesso

| Email                  | Senha |
| ---------------------- | ----- |
| `aluno@fiap.com.br`    | `12345` |

### Roteiro de Testes

1.  **Teste de Login:**
    * Na tela inicial, insira as credenciais acima e clique em "Entrar".
    * **Resultado Esperado:** O aplicativo deve te levar para a tela de **Quiz**.

2.  **Teste do Quiz de Perfil:**
    * Responda às 3 perguntas do quiz.
    * **Resultado Esperado:** Ao responder a última pergunta, o aplicativo deve calcular seu perfil e te levar automaticamente para a tela de **Portfólio**, exibindo a carteira correspondente.

3.  **Teste de Conteúdo Dinâmico:**
    * No Portfólio, clique em "Sair".
    * Faça o login novamente e responda ao quiz com opções diferentes para obter um novo perfil (ex: tente obter o perfil "Agressivo").
    * **Resultado Esperado:** A tela de Portfólio deve exibir uma carteira completamente diferente, adequada ao novo perfil.

4.  **Teste de Persistência de Sessão:**
    * Com a tela de Portfólio aberta, feche o aplicativo completamente.
    * Abra o aplicativo novamente.
    * **Resultado Esperado:** O aplicativo deve pular a tela de Login e o Quiz, abrindo diretamente na sua **tela de Portfólio**, pois ele "lembrou" da sua sessão e do seu perfil.

5.  **Teste de Logout:**
    * Na tela de Portfólio, clique no botão vermelho "Sair".
    * **Resultado Esperado:** O aplicativo deve limpar a sessão e te levar de volta para a **tela de Login**.

---


