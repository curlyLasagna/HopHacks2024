import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Text, TextInput, Button } from 'react-native';

const App = () => {
  const [barcode, setBarcode] = useState<string | null>(null); // Start with null to prevent initial fetch
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Regex pattern for validating barcode 
  const barcodePattern = /^\d{8}$/;

  const validateInput = (input: string): boolean => {
    return barcodePattern.test(input);
  };

  const fetchImage = () => {
    if (!validateInput(inputValue.trim())) {
      setError('Invalid barcode format. It should be exactly 8 digits.');
      // No need to fetch if the input is empty
      return;
    }

    setError(null); // Clear previous errors
    setBarcode(inputValue.trim()); // Set barcode state to trigger fetch
  };

  useEffect(() => {
    if (barcode) {
      // Function to fetch image based on barcode

      setLoading(true); // Set loading to true before fetching
      setRequestInProgress(true); // Set requestInProgress to true
      fetch(`https://barcodeapi.org/api/128/220552${barcode}`, {
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
    setError(null);
  };

  const handleSubmit = async () => {
    if (validateInput(inputValue.trim()) && !requestInProgress) {
      fetchImage(); // Call function to set barcode and trigger API fetch
      storeUserID(inputValue)
      console.log("this is user ID", await getUserID())
    }else {
      setError('Invalid input. Please enter exactly 8 digits.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const storeUserID = async (userID: string) => {
    console.log(userID);
    try {
      await AsyncStorage.setItem('userID', userID);
    } catch (error) {
      console.log("Your phone sucks");
    }
  }

  const getUserID = async () => {
    let userID: string | null = "";
    try {
      userID = await AsyncStorage.getItem('userID');
      if (userID) {
        setBarcode(userID)
      }
    } catch (error) {
      console.log("Your phone sucks");
    }
    return userID;
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.prefixBarcode}>220552</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter barcode number"
          value={inputValue}
          onChangeText={handleInputChange}
          keyboardType="numeric"
        />
      </View>
      <Button title="Fetch Image" onPress={handleSubmit} />
      {error && <Text style={styles.error}>{error}</Text>}
      {imageBase64 ? (
        <Image
          source={{ uri: imageBase64 }}   // Use the base64 string as the image source
          style={styles.image}
        />
      ) : (
        inputValue && !error ? <Text>No Image Available</Text> : <Text>Please enter a barcode number</Text>

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
  prefixBarcode: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16, // Space between text and input
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%', // Increase width to make the container larger
    paddingHorizontal: 16, // Add horizontal padding inside the container
    paddingVertical: 8, // Add vertical padding inside the container
  },
  image: {
    width: '45%',
    height: '45%',
    resizeMode: 'contain',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});

export default App;
