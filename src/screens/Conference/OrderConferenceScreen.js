import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MyModal from "../../modal/MyModal";
import apiServices from '../../services/apiServices';
import BarcodeScannerModal from '../Modal/BarcodeScannerModal';

export default function OrderConferenceScreen({ navigation }) {
  const [orderNumber, setOrderNumber] = useState('');
  const [successSound, setSuccessSound] = useState();
  const [errorSound, setErrorSound] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
   const scannerRef = useRef();

  useEffect(() => {
    async function loadSounds() {
      const { sound: loadedSuccess } = await Audio.Sound.createAsync(
        require('../../assets/success.mp3')
      );
      setSuccessSound(loadedSuccess);

      const { sound: loadedError } = await Audio.Sound.createAsync(
        require('../../assets/error.mp3')
      );
      setErrorSound(loadedError);
    }

    loadSounds();

    return () => {
      if (successSound) successSound.unloadAsync();
      if (errorSound) errorSound.unloadAsync();
    };
  }, []);

  const handleSearch = async (number ) => {
    const orderNum = number || orderNumber; 
    console.log('Botão clicado!');
    if (!orderNum) {
      Alert.alert('Erro', 'Por favor, digite o número do pedido.');
      if (errorSound) await errorSound.replayAsync();
      return;
    }

    try {
      
      const response = await apiServices.getOrder(orderNum);
      const order = response.data;

      
      // Verifica se o status do pedido é "PENDING"
      if (order.status === 'SEPARED') {
       
        if (successSound) await successSound.replayAsync();

        // Navega para a tela de conferência com os itens do pedido
        navigation.navigate('ItemsConferenceScreen', { items: order.items, orderId: order.id });
      } else if(order.status === 'PENDING'){
        if (errorSound) await errorSound.replayAsync();
        setModalMessage('Pedido ainda não separado.');
        setIsModalVisible(true);
      }else {
        
        if (errorSound) await errorSound.replayAsync();
        // Exibe o modal caso o pedido já tenha sido conferido ou separado
        setModalMessage('Pedido já finalizado');
        setOrderNumber("")
        setIsModalVisible(true);
        if (errorSound) await errorSound.replayAsync();
      }
    } catch (error) {
      console.error(error);
      if (errorSound) await errorSound.replayAsync();
      setModalMessage('Pedido Não encontrado');
      setOrderNumber("")
      setIsModalVisible(true)
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setModalMessage('');
  };


  const openScanner = async () => {
    try {
      const data = await scannerRef.current.open();

      handleBarCodeRead(data.data);

    } catch (error) {
        console.log(error)
    }
  }

  function handleBarCodeRead(data) {
    console.log(data);



    if (data) {
      setOrderNumber(data)

      handleSearch(data);
    }
  }

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
      <TouchableOpacity onPress={openScanner} style={styles.button}>
          <Ionicons name="camera" size={24} color="white" />
        </TouchableOpacity>

        <BarcodeScannerModal ref={scannerRef} />
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
    marginTop: 5,
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
