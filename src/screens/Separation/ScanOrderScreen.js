import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MyModal from '../../modal/MyModal';
import apiServices from '../../services/apiServices';
import BarcodeScannerModal from '../Modal/BarcodeScannerModal';

export default function ScanOrderScreen({ navigation }) {
  const [orderNumber, setOrderNumber] = useState('');
  const [successSound, setSuccessSound] = useState();
  const [errorSound, setErrorSound] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');


  const scannerRef = useRef();

  const openScanner = async () => {
    try {
      const data = await scannerRef.current.open();

      handleBarCodeRead(data.data);

    } catch (error) {

    }
  }

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

  const handleSearch = async (number) => {
    const orderNum = number || orderNumber; 
    console.log("pedido    ",orderNum)
    if (!orderNum) {
      Alert.alert('Erro', 'Por favor, digite o número do pedido.');
      if (errorSound) await errorSound.replayAsync();
      return;
    }

    try {

      console.log("order antes "  , orderNum)
      const response = await apiServices.getOrder(orderNum);
      const order = response.data;

      console.log("Oder numero " , order )
      if (order.status === 'PENDING') {
        if (successSound) await successSound.replayAsync();
        navigation.navigate('ScanItemsScreen', { items: order.items, orderId: order.id });
      } else {
        setModalMessage('Pedido já Separado');
        setIsModalVisible(true);
        if (errorSound) await errorSound.replayAsync();
      }

      setOrderNumber("")
    } catch (error) {
      if (errorSound) await errorSound.replayAsync();
      setModalMessage('Pedido Não encontrado');
      setIsModalVisible(true);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setModalMessage('');
  };


  function handleBarCodeRead(data) {
    console.log(data);



    if (data) {
      setOrderNumber(data)

      handleSearch(data);
    }
  }


  return (
    <View style={styles.container}>
      <MyModal visible={isModalVisible} message={modalMessage} onClose={closeModal} />

      <Text style={styles.title}>Separação de Pedidos</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o número do pedido"
          keyboardType="numeric"
          value={orderNumber}
          onChangeText={setOrderNumber}
          placeholderTextColor="#999"
        />

        <TouchableOpacity onPress={openScanner} style={styles.iconButton}>
          <Ionicons name="camera" size={24} color="white" />
        </TouchableOpacity>

      </View>
      
      <BarcodeScannerModal ref={scannerRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003366',
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
  iconButton: {
    backgroundColor: '#0057b7',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  button: {
    backgroundColor: '#0057b7',
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
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

});
