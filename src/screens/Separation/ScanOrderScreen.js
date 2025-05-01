import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Modal, Button } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import MyModal from '../../modal/MyModal';
import apiServices from '../../services/apiServices';

export default function ScanOrderScreen({ navigation }) {
  const [orderNumber, setOrderNumber] = useState('');
  const [successSound, setSuccessSound] = useState();
  const [errorSound, setErrorSound] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleSearch = async () => {
    if (!orderNumber) {
      Alert.alert('Erro', 'Por favor, digite o número do pedido.');
      if (errorSound) await errorSound.replayAsync();
      return;
    }

    try {
    
      const response = await apiServices.getOrder(orderNumber);
      const order = response.data;

      if (order.status === 'PENDING') {
        if (successSound) await successSound.replayAsync();
        navigation.navigate('Order', { items: order.items, orderId: order.id });
      } else {
        setModalMessage('Pedido já Separado');
        setIsModalVisible(true);
        if (errorSound) await errorSound.replayAsync();
      }
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

  async function handleOpenCamera() {
    try {
      const { granted } = await requestPermission();

      if (!granted) {
        setModalMessage("Você precisa de permissão para acessar a câmera");
        return <MyModal visible={isModalVisible} message={modalMessage} onClose={closeModal} />;
      }
      setModalVisible(true);
    } catch (error) {
      console.log(error);
    }
  }

  function handleBarCodeRead(data) {
    console.log(data);

    

    if(data){
      setOrderNumber(data)

      handleSearch();
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

<TouchableOpacity onPress={handleOpenCamera} style={styles.iconButton}>
        <Ionicons name="camera" size={24} color="white" />
      </TouchableOpacity>

      </View>

     
     {/* <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Buscar Pedido</Text>
      </TouchableOpacity>*/}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={handleBarCodeRead}
          />
         
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>

          {/* Risco vermelho centralizado */}
          <View style={styles.centerLine}></View>
        </View>
      </Modal>
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
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
  },
  camera: {
    width: '100%', // Largura da câmera
    height: 300,  // Altura da câmera
    backgroundColor: '#fff', // Fundo branco para a câmera
    borderRadius: 10, // Arredondar os cantos
    alignItems: "center"
  },
  cancelButtonContainer: {
    marginTop: 20,
  },
  centerLine: {
    position: 'absolute',
    top: '50%', // Posição vertical no meio
    left: 0,    // Começa no lado esquerdo
    width: '100%', // Largura 100% para atravessar toda a tela
    height: 2,    // Espessura do risco
    backgroundColor: 'red',// Ajuste para centralizar exatamente
  },
});
