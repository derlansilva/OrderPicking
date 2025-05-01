import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert , TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function LoginScreen({ navigation }){
  const [registration, setRegistration] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Simulação de login. Substitua pela sua API real:
      if (registration === '80257' && password === '1234') {
        navigation.replace('Home'); // Redireciona para a Home
      } else {
        Alert.alert('Login inválido', 'E-mail ou senha incorretos');
      }
    } catch (error) {
      Alert.alert('Erro de login', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Matricula"
        value={registration}
        onChangeText={setRegistration}
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

      
       <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}  // Navega para a tela de conferência
            >
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#0057b7',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

