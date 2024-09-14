import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Text } from 'react-native';

const App = () => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch binary data from API
    fetch('https://barcodeapi.org/api/128/123455678', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    })
      .then(response => response.arrayBuffer())  // Get the binary data as an ArrayBuffer
      .then(buffer => {
        const base64Flag = 'data:image;base64,';  // Use correct MIME type, change 'jpeg' as per your image type
        const imageStr = arrayBufferToBase64(buffer);  // Convert ArrayBuffer to base64 string
        setImageBase64(base64Flag + imageStr);         // Set image as base64 string
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching image:', error);
        setLoading(false);
      });
  }, []);

  // Function to convert ArrayBuffer to base64 string
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);  // base64 encode the string
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
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
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default App;

