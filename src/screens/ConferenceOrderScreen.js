import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';
import MyModal from "../modal/MyModal";

export default function ConferenceOrderScreen({ navigation }) {
  const [orderNumber, setOrderNumber] = useState('');
  const [successSound, setSuccessSound] = useState();
  const [errorSound, setErrorSound] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    async function loadSounds() {
      const { sound: loadedSuccess } = await Audio.Sound.createAsync(
        require('../assets/success.mp3')
      );
      setSuccessSound(loadedSuccess);

      const { sound: loadedError } = await Audio.Sound.createAsync(
        require('../assets/error.mp3')
      );
      setErrorSound(loadedError);
    }

    loadSounds();

    return () => {
      if (successSound) successSound.unloadAsync();
      if (errorSound) errorSound.unloadAsync();
    };
  }, []);

  const handleSearch = async () => {
    console.log('Botão clicado!');
    if (!orderNumber) {
      Alert.alert('Erro', 'Por favor, digite o número do pedido.');
      if (errorSound) await errorSound.replayAsync();
      return;
    }

    try {
      const url = `http://192.168.0.12:8080/order/${orderNumber}`;
      console.log('Buscando:', url);
      const response = await axios.get(url);
      const order = response.data;

      console.log('Pedido encontrado:', order);

      // Verifica se o status do pedido é "PENDING"
      if (order.status === 'CONFERED') {
       
        if (successSound) await successSound.replayAsync();

        // Navega para a tela de conferência com os itens do pedido
        navigation.navigate('ConferenceScreen', { items: order.items, orderId: order.id });
      } else if(order.status === 'PENDING'){
        if (errorSound) await errorSound.replayAsync();
        setModalMessage('Pedido ainda não separado.');
        setIsModalVisible(true);
      }else {
        
        if (errorSound) await errorSound.replayAsync();
        // Exibe o modal caso o pedido já tenha sido conferido ou separado
        setModalMessage('Pedido já finalizado');
        setIsModalVisible(true);
        if (errorSound) await errorSound.replayAsync();
      }
    } catch (error) {
      console.error(error);
      if (errorSound) await errorSound.replayAsync();
      setModalMessage('Pedido Não encontrado');
      setIsModalVisible(true)
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setModalMessage('');
  };

  return (
    <View style={styles.container}>
      {/* Exibe o modal de erro ou aviso */}
      <MyModal
        visible={isModalVisible}
        message={modalMessage}
        onClose={closeModal}
      />
      <Text style={styles.title}>Conferência de Pedidos</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o número do pedido"
          keyboardType="numeric"
          value={orderNumber}
          onChangeText={setOrderNumber}
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Buscar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8', // fundo cinza claro estilo SAP
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003366', // azul escuro SAP
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#0057b7', // azul forte SAP
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
    elevation: 5, // sombra no Android
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
