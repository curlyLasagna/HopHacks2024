import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Text, TextInput, Button } from 'react-native';

const App = () => {
  const [barcode, setBarcode] = useState('123455678'); // Default barcode

  const storeID = async (onecard_val: string) => {
    const [userEntered: Boolean, setUserEntered] = useState();

    try {
      await AsyncStorage.setItem('ID', onecard_val);
    } catch (e) {
      console.log("your phone sucks");
    }
  }
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('123455678'); // Initial value for input

  useEffect(() => {
    // Function to fetch image based on barcode
    const fetchImage = () => {
      setLoading(true); // Set loading to true before fetching
      fetch(`https://barcodeapi.org/api/128/${barcode}`, {
        method: 'GET'
      })
        .then(response => {
          console.log('Response Status:', response.status);  // Log the response status
          return response.arrayBuffer();
        })  // Get the binary data as an ArrayBuffer
        .then(buffer => {
          console.log('Received buffer:', buffer.byteLength);
          const base64Flag = 'data:image/png;base64,';  // Use correct MIME type
          const imageStr = arrayBufferToBase64(buffer);  // Convert ArrayBuffer to base64 string
          setImageBase64(base64Flag + imageStr);         // Set image as base64 string
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching image:', error);
          setLoading(false);
        });
    };

    fetchImage();
  }, [barcode]); // Fetch image whenever the barcode changes

  // Function to convert ArrayBuffer to base64 string
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return global.btoa(binary);  // Use global.btoa in React Native environment
  };

  const handleInputChange = (text: string) => {
    setInputValue(text); // Update inputValue state
  };

  const handleSubmit = () => {
    setBarcode(inputValue); // Update barcode state to trigger fetch
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter barcode number"
        value={inputValue}
        onChangeText={handleInputChange}
        keyboardType="numeric"
      />
      <Button title="Fetch Image" onPress={handleSubmit} />
      {imageBase64 ? (
        <Image
          source={{ uri: imageBase64 }}   // Use the base64 string as the image source
          style={styles.image}
        />
      ) : (
        <Text>No Image Available</Text>   // Handle case when no image is available
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: '100%',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default App;
