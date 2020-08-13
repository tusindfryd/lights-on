import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { EvilIcons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import * as Sharing from 'expo-sharing';
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from 'expo-file-system';
import * as WebBrowser from 'expo-web-browser';
// import * as Brightness from 'expo-brightness';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [colorIndex, setColorIndex] = useState(0);
  const [photoUri, setPhotoUri] = useState("");
  const [showInfo, setshowInfo] = useState(false);
  const cameraRef = useRef(null);

  const height = Dimensions.get('screen').height;
  const width = Dimensions.get('screen').width;
  const previewScale = 0.2;
  const photoScale = 0.8;

  const backgroundColors = [
    "#ff0000", "#ffbf00", "#85a300", "#36cc00", "#00cc9c", "#000dff", "#8800ff", "#bb00ff", "#ff0077"
  ];

  const styles = StyleSheet.create({
    preview: {
      top: (height - (16 / 9 * width * previewScale)) / 2,
      left: (width - width * previewScale) / 2,
      width: width * previewScale,
      height: 16 / 9 * width * previewScale
    },
    container: {
      position: "absolute",
      borderColor: "white",
      borderWidth: 1.5,
      top: (height - (16 / 9 * width * photoScale)) / 2,
      left: (width - width * photoScale) / 2,
      width: width * photoScale,
      height: 16 / 9 * width * photoScale,
      display: "flex",
    },
    icons: {
      position: "absolute",
      width: width,
      bottom: (height - 16 - ((height - (16 / 9 * width * photoScale)) / 2 + 16 / 9 * width * photoScale)) / 2,
      display: "flex",
      flexDirection: "row",
      justifyContent: "center"
    },
    info: {
      color: "white",
      paddingHorizontal: 30,
      textAlign: "justify",
      lineHeight: 25
    }
  });

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // maybe this will work one day but now is not that day
  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Brightness.requestPermissionsAsync();
  //     if (status === 'granted') {
  //       Brightness.setSystemBrightnessAsync(1);
  //     }
  //   })();
  // }, []);

  let takePicture = async () => {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync();
      photo = await ImageManipulator.manipulateAsync(photo.uri,
        [{ flip: ImageManipulator.FlipType.Horizontal }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG })
      setPhotoUri(photo.uri);
    }
  }

  let deletePicture = () => {
    Alert.alert(
      "Delete photo",
      "The photo will be deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Okay", onPress: () => {
            FileSystem.deleteAsync(photoUri);
            setPhotoUri("");
          }
        }
      ],
      { cancelable: true }
    );
  }

  let savePicture = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      await MediaLibrary.saveToLibraryAsync(photoUri);
      await FileSystem.deleteAsync(photoUri);
      Alert.alert(
        "Saved",
        "The photo was saved to the Camera Roll.",
        [
          { text: "Okay", onPress: () => setPhotoUri("") }
        ],
        { cancelable: true }
      );
    }
    else {
      alert("Camera Roll access not granted");
    }
  }

  let sharePicture = async () => {
    await Sharing.shareAsync(photoUri);
  };

  let openTwitter = async () => {
    await WebBrowser.openBrowserAsync('https://twitter.com/intent/tweet?url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dio.lightson&text=');
  };

  let openGithub = async () => {
    await WebBrowser.openBrowserAsync('https://github.com/tusindfryd/lights-on');
  };

  return (
    <TouchableOpacity
      style={{
        width: width,
        height: height,
        backgroundColor: backgroundColors[colorIndex % backgroundColors.length]
      }}
      onPress={() => photoUri == "" ? setColorIndex(colorIndex + 1) : null}
    >
      {hasPermission === false &&
        <View style={styles.container}>
          <Text style={{ flex: 1, textAlignVertical: "center", textAlign: "center", color: "white" }}>
            Camera permissions not granted.
          </Text>
        </View>
      }

      <EvilIcons name="eye"
        onPress={() => showInfo ? setshowInfo(false) : setshowInfo(true)}
        size={32}
        color="white"
        style={{
          position: "absolute",
          top: 50,
          right: 30
        }}
      />

      {showInfo &&
        <TouchableOpacity
          style={[styles.container, { zIndex: 1, paddingVertical: 30 }]}
          onPress={() => setshowInfo(false)}
        >
          <Text
            style={[styles.info, { fontWeight: "bold", textAlign: "center", paddingTop: 30, flex: 1 }]}
          >
            Lights On{'\n'}
          </Text>

          <Text style={[styles.info, { flex: 2 }]}>
            Tap the <Text style={{ fontWeight: "bold" }}>background </Text>
            to change the <Text style={{ fontWeight: "bold" }}>light color</Text>.{'\n'}
            Tap the <Text style={{ fontWeight: "bold" }}>camera preview </Text>
            to <Text style={{ fontWeight: "bold" }}>take a photo</Text>.
          </Text>

          <Text style={[styles.info, { flex: 2, fontWeight: "bold" }]}>
            Works best with brightness set to maximum.
          </Text>

          <View
            style={[styles.info, { flex: 1, display: "flex", flexDirection: "row", justifyContent: "center" }]}
          >
            <EvilIcons
              name="sc-github"
              size={32}
              color="white"
              style={{ paddingHorizontal: 30 }}
              onPress={() => openGithub()}
            />

            <EvilIcons
              name="sc-twitter"
              size={32}
              color="white"
              style={{ paddingHorizontal: 30 }}
              onPress={() => openTwitter()}
            />
          </View>

          <Text style={[styles.info, { flex: 1, textAlign: "center" }]}>2020</Text>

        </TouchableOpacity>
      }

      {hasPermission === true && photoUri == "" && !showInfo &&
        <Camera
          ref={cameraRef}
          style={styles.preview}
          ratio="16:9"
          type={Camera.Constants.Type.front}
          flash={Camera.Constants.FlashMode.off}
          whiteBalance={Camera.Constants.WhiteBalance.sunny}
        >
          <TouchableOpacity
            style={{
              borderColor: "white",
              borderWidth: 1.5,
              width: width * previewScale,
              height: 16 / 9 * width * previewScale
            }}
            onPress={() => takePicture()}
          />
        </Camera>
      }

      {photoUri !== "" && !showInfo &&
        <>
          <Image source={{ uri: photoUri }}
            style={styles.container}
          />
          <View style={styles.icons}>
            <EvilIcons
              name="trash"
              size={32}
              color="white"
              accessibilityLabel="Delete"
              style={{ paddingHorizontal: 30 }}
              onPress={() => deletePicture()}
            />
            <EvilIcons
              name="archive"
              size={32}
              color="white"
              accessibilityLabel="Save"
              style={{ paddingHorizontal: 30 }}
              onPress={() => savePicture()}
            />
            <EvilIcons
              name="share-apple"
              size={32}
              color="white"
              accessibilityLabel="Share"
              style={{ paddingHorizontal: 30 }}
              onPress={() => sharePicture()}
            />
          </View>
        </>
      }
    </TouchableOpacity>
  );
}
