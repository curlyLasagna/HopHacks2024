import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Text, TextInput, Button } from 'react-native';

const App = () => {
<<<<<<< HEAD
  const [barcode, setBarcode] = useState('123455678'); // Default barcode

  const storeID = async (onecard_val: string) => {
    const [userEntered: Boolean, setUserEntered] = useState();

    try {
      await AsyncStorage.setItem('ID', onecard_val);
    } catch (e) {
      console.log("your phone sucks");
    }
  }
||||||| c745af5
  const [barcode, setBarcode] = useState('123455678'); // Default barcode
=======
  const [barcode, setBarcode] = useState<string | null>(null); // Start with null to prevent initial fetch
>>>>>>> 19bd06acdba4012104588a914d465204da6762d9
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [requestInProgress, setRequestInProgress] = useState(false);

  const fetchImage = () => {
    if (!inputValue.trim()) {
      // No need to fetch if the input is empty
      return;
    }

    setBarcode(inputValue.trim()); // Set barcode state to trigger fetch
  };

  useEffect(() => {
    if (barcode) {
      // Function to fetch image based on barcode

      setLoading(true); // Set loading to true before fetching
      setRequestInProgress(true); // Set requestInProgress to true
      fetch(`https://barcodeapi.org/api/128/${barcode}`, {
        method: 'GET',
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
          setRequestInProgress(false);
        })
        .catch(error => {
          console.error('Error fetching image:', error);
          setLoading(false);
          setRequestInProgress(false);
        });
    }
  }, [barcode]); // Fetch image whenever the barcode changes, if it's not null

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
    if (inputValue.trim() && !requestInProgress) {
      fetchImage(); // Call function to set barcode and trigger API fetch
    }
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
        inputValue ? <Text>No Image Available</Text> : <Text>Please enter a barcode number</Text>
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
