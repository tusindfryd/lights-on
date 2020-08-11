import React, { useState, useEffect } from 'react';
import { Image, Button, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
// import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [colorIndex, setColorIndex] = useState(0);
  const [photoUri, setPhotoUri] = useState("");
  let camera;

  const backgroundColors = [
    "blue", "red", "green", "yellow", "white"
  ]

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  let takePicture = async () => {
    if (camera) {
      let photo = await camera.takePictureAsync();
      setPhotoUri(photo.uri);
      console.log(photoUri);
    }
  }

  let openShareDialogAsync = async () => {
    await Sharing.shareAsync(photoUri);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (photoUri) {
    return (
      <>
        <Image source={{ uri: photoUri }}
          style={{
            top: (Dimensions.get('screen').height - (16 / 9 * Dimensions.get('screen').width * 0.8)) / 2,
            left: (Dimensions.get('screen').width - Dimensions.get('screen').width * 0.8) / 2,
            width: Dimensions.get('screen').width * 0.8,
            height: 16 / 9 * Dimensions.get('screen').width * 0.8
          }} />
        <Button
          onPress={() => setPhotoUri("")}
          title="Trash"
          color="#841584"
          accessibilityLabel="Trash"
        />
        <Button
          onPress={() => openShareDialogAsync()}
          title="Save"
          color="#841584"
          accessibilityLabel="Save"
        />
      </>
    )
  }
  return (
    <TouchableOpacity style={{
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      backgroundColor: backgroundColors[colorIndex % backgroundColors.length]
    }} onPress={() => setColorIndex(colorIndex + 1)}>

      <Camera
        ref={ref => (camera = ref)}
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
          onPress={() => takePicture()}>
        </TouchableOpacity>
      </Camera>

    </TouchableOpacity>
  );
}
