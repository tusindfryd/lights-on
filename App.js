import React, { useState, useEffect } from 'react';
import { Image, Text, View, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import * as Sharing from 'expo-sharing';
import * as ImageManipulator from "expo-image-manipulator";

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
      photo = await ImageManipulator.manipulateAsync(photo.uri,
        [{ flip: ImageManipulator.FlipType.Horizontal }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG })
      setPhotoUri(photo.uri);
    }
  }

  let savePicture = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      MediaLibrary.saveToLibraryAsync(photoUri);
      Alert.alert(
        "Saved",
        "The photo was saved to the Camera Roll.",
        [
          { text: "Okay", onPress: () => setPhotoUri("") }
        ],
        { cancelable: false }
      );
    }
    else {
      alert("Camera Roll access not granted");
    }
  }

  let sharePicture = async () => {
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
      <View style={{
        height: Dimensions.get('screen').height,
        backgroundColor: backgroundColors[colorIndex % backgroundColors.length]
      }}>
        <Image source={{ uri: photoUri }}
          style={{
            top: (Dimensions.get('screen').height - (16 / 9 * Dimensions.get('screen').width * 0.8)) / 2,
            left: (Dimensions.get('screen').width - Dimensions.get('screen').width * 0.8) / 2,
            width: Dimensions.get('screen').width * 0.8,
            height: 16 / 9 * Dimensions.get('screen').width * 0.8
          }} />

        <View style={{
          position: "absolute",
          width: Dimensions.get('screen').width,
          bottom: 50,
          display: "flex", flexDirection: "row", justifyContent: "center"
        }}>
          <Ionicons name="ios-save" size={32} color="white" accessibilityLabel="Save" style={{ paddingHorizontal: 30 }}
            onPress={() => savePicture()}
          />
          <Ionicons name="ios-trash" size={32} color="white" accessibilityLabel="Delete" style={{ paddingHorizontal: 30 }}
            onPress={() => setPhotoUri("")}
          />
          <Ionicons name="ios-share" size={32} color="white" accessibilityLabel="Share" style={{ paddingHorizontal: 30 }}
            onPress={() => sharePicture()}
          />
        </View>
      </View>
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
