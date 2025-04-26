import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import MyModal from '../modal/MyModal';


export default function OrderScreen({ route, navigation }) {
  const { items } = route.params;
  const [scannedCode, setScannedCode] = useState('');
  const [orderItems, setOrderItems] = useState(items);
  const [successSound, setSuccessSound] = useState();
  const [errorSound, setErrorSound] = useState();

  const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    console.log(items);
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

  const handleScan = async () => {
    if (!scannedCode.trim()) {
      return;
    }

    const index = orderItems.findIndex(item => item.sku === scannedCode.trim());

    if (index !== -1) {
      const updatedItems = [...orderItems];
      if (updatedItems[index].quantity > 1) {
        updatedItems[index].quantity -= 1;
      } else {
        updatedItems.splice(index, 1);
      }
      setOrderItems(updatedItems);
      setScannedCode('');
      if (successSound) await successSound.replayAsync();
    } else {
      setScannedCode('');
      if (errorSound) await errorSound.replayAsync();
    }
  };

  const handleFinish = async () => {
    try {
      // Exemplo de ID do pedido (você pode passar pelo route.params também)
      const orderId = route.params.orderId;
 
      console.log(orderId)
  
      // Chamada para sua API Spring
      const url = `http://192.168.0.12:8080/order/${orderId}`;
      console.log('Buscando:', url);
      const response = await axios.put(url);
      const order = response.data;

      if (response.status === 200) {
        setModalMessage('Separação finalizada');
        setIsModalVisible(true);
        navigation.goBack(); // Volta para a tela anterior
      } else {
        setModalMessage('Erro', 'Não foi possível finalizar a separação.')
        setIsModalVisible(true);
       
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao conectar com o servidor.');
    }
  };

  
  

  const handleInterrupt = () => {
    Alert.alert(
      'Interromper Conferência',
      'Existem itens não conferidos. Deseja realmente interromper?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sim', onPress: () => navigation.goBack() },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemSku}> {item.sku}</Text>
      <Text style={styles.itemDescription}> {item.description}</Text>
      <Text style={styles.itemQuantity}>Quantidade  {item.quantity}</Text>
    </View>
  );

  const closeModal = () => {
    setIsModalVisible(false);
    setModalMessage('');
  };

  return (
    <View style={styles.container}>
      <MyModal
        visible={isModalVisible}
        message={modalMessage}
        onClose={closeModal}
      />
      <Text style={styles.title}>Conferir Itens</Text>

      {orderItems.length > 0 ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="codigo"
            value={scannedCode}
            onChangeText={setScannedCode}
            onSubmitEditing={handleScan}
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.button} onPress={handleScan}>
            <Text style={styles.buttonText}>Confirmar Leitura</Text>
          </TouchableOpacity>

          <FlatList
            data={orderItems}
            keyExtractor={(item) => item.sku}
            renderItem={renderItem}
            style={{ marginTop: 20, width: '100%' }}
            ListFooterComponent={
              <TouchableOpacity style={styles.interruptButton} onPress={handleInterrupt}>
                <Text style={styles.interruptButtonText}>Interromper Conferência</Text>
              </TouchableOpacity>
            }
          />
        </>
      ) : (
        <>
          <Text style={styles.finishedText}>Todos os itens foram separados!</Text>
          <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
            <Text style={styles.finishButtonText}>Finalizar Separação</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    width: '100%',
    marginBottom: 10,
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
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemSku: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDescription: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  itemQuantity: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
  },
  finishedText: {
    fontSize: 20,
    color: '#0057b7',
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  finishButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  interruptButton: {
    backgroundColor: '#ff9900',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 40,
  },
  interruptButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
