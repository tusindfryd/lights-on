import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Dimensions, Vibration } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [colorIndex, setColorIndex] = useState(0)

  const backgroundColors = [
    "blue", "red", "green", "yellow", "white"
  ]

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <TouchableOpacity style={{
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      backgroundColor: backgroundColors[colorIndex % backgroundColors.length]
    }} onPress={() => setColorIndex(colorIndex + 1)}>

      <Camera
        style={{
          top: (Dimensions.get('screen').height - (16 / 9 * Dimensions.get('screen').width * 0.2)) / 2,
          left: (Dimensions.get('screen').width - Dimensions.get('screen').width * 0.2) / 2,
          width: Dimensions.get('screen').width * 0.2,
          height: 16 / 9 * Dimensions.get('screen').width * 0.2
        }}
        ratio="16:9"
        type={Camera.Constants.Type.front}
        flash={Camera.Constants.FlashMode.off}
        whiteBalance={Camera.Constants.WhiteBalance.fluorescent}
      >
        <TouchableOpacity style={{
          width: Dimensions.get('screen').width * 0.2,
          height: 16 / 9 * Dimensions.get('screen').width * 0.2
        }}
          onPress={null}>
        </TouchableOpacity>
      </Camera>

    </TouchableOpacity>
  );
}
