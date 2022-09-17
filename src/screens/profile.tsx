import {View, Text, Image, Input, Button} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';

import {ref, getDownloadURL, uploadBytes} from 'firebase/storage';
import uuid from 'react-native-uuid';

import * as ImagePicker from 'expo-image-picker';
import {db, storage} from '../utils/firebase';
import {addDoc, collection, doc, updateDoc} from 'firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {updateUser} from '../utils/store';
import {useNavigation} from '@react-navigation/native';

export const ProfileScreen = () => {
  const user = useSelector(state => state.auth.user);
  const {goBack} = useNavigation();
  const {control, handleSubmit} = useForm({
    defaultValues: {
      ...user,
    },
  });
  const dispatch = useDispatch();
  const [image, setImage] = useState(user.photoURL);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const photoURL = await uploadImageAsync(result.uri);
      setImage(photoURL);
    }
  };

  async function uploadImageAsync(uri: string) {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    console.log(blob);

    const fileRef = ref(storage, uuid.v4());
    const result = await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    // blob.close();

    return await getDownloadURL(fileRef);
  }

  const handleSubmitProfile = async data => {
    const docRef = doc(db, 'user', user.id);
    await updateDoc(docRef, {
      ...data,
      photoURL: image,
    }).then(response => {
      dispatch(updateUser({...data, photoURL: image}));

      goBack();
    });
  };

  return (
    <View
      p={4}
      mt={12}
      display="flex"
      flexDir={'column'}
      justifyContent="center"
      alignItems={'center'}>
      <Button onPress={pickImage} variant="ghost">
        <Image
          width={90}
          height={90}
          backgroundColor="gray.200"
          rounded={'full'}
          source={{uri: image}}
        />
      </Button>
      <Controller
        control={control}
        name="firstName"
        render={({field}) => {
          return (
            <Input
              placeholder="First Name"
              {...field}
              my={2}
              onChangeText={field.onChange}
            />
          );
        }}
      />
      <Controller
        control={control}
        name="lastName"
        render={({field}) => (
          <Input
            placeholder="Last Name"
            {...field}
            my={2}
            onChangeText={field.onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="location"
        render={({field}) => (
          <Input
            placeholder="Location"
            {...field}
            my={2}
            onChangeText={field.onChange}
          />
        )}
      />

      <Button my={2} onPress={handleSubmit(handleSubmitProfile)}>
        <Text color={'white'}>Update Profile</Text>
      </Button>
    </View>
  );
};
