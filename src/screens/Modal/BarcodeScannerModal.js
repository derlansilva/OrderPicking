import React, { forwardRef, useImperativeHandle, useState } from "react";

import { CameraView } from 'expo-camera'; // ou de onde você usa a Camera
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const BarcodeScannerModal = forwardRef((props , ref) => {
    const [visible , setVisible]  = useState(false);
    const [resolver , setResolver ] = useState(null);

    useImperativeHandle(ref , () => ({
        open:()=> {
            setVisible(true)

            return new Promise((resolve) => {
                setResolver(() => resolve)
            })
        },

        close: () => {
            setVisible(false);
        }
    }));

    const handleBarCodeRead = (result) => {
        if(resolver){
            resolver(result);
            setVisible(false);
        }
    };

    return(
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <CameraView
                    style={styles.camera}
                    facing="back"
                    onBarcodeScanned={handleBarCodeRead}
                />
                <TouchableOpacity style={styles.button} onPress={() => setVisible(false)}>
                    <Text>Cancelar</Text>
                </TouchableOpacity>

                <View style={styles.centerLine}></View>
            </View>
        </Modal>
    )
})


const styles = StyleSheet.create({
    
    button: {
      position: "absolute",
      bottom: 50,
      padding: 10,
      backgroundColor: "#ff0000",
      borderRadius: 5,
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
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
        //borderRadius: 10, // Arredondar os cantos
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

  

  export default BarcodeScannerModal;