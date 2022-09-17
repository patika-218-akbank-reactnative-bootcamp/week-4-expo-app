import React from 'react';

import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth, db} from '../utils/firebase';
import {useDispatch} from 'react-redux';
import {signIn} from '../utils/store';

import {useNavigation} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import {Button, Input, Text, View, useToast} from 'native-base';
import {doc, getDoc} from 'firebase/firestore';

export const SignInScreen = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: 'enesozturk.d@gmail.com',
      password: 'enes.123',
    },
  });
  const {show} = useToast();
  const {navigate} = useNavigation();
  const dispatch = useDispatch();

  const handleSignIn = data => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(async response => {
        const userDoc = doc(db, 'user', response.user.uid);
        const userRef = await getDoc(userDoc);
        if (userRef.exists()) {
          dispatch(signIn(userRef.data()));
        }
      })
      .catch(err => {
        show({
          description: err.message,
        });
      });
  };

  return (
    <View p={4}>
      <Controller
        name="email"
        control={control}
        rules={{
          required: {value: true, message: 'Email is required'},
          minLength: {value: 10, message: 'Email can be at least 10 chars. '},
        }}
        render={({field}) => {
          return (
            <Input
              placeholder="E-mail"
              autoCapitalize="none"
              my={2}
              {...field}
              onChangeText={field.onChange}
            />
          );
        }}
      />
      {errors.email ? (
        <Text style={{color: 'red'}}>{errors.email.message}</Text>
      ) : null}

      <Controller
        name="password"
        control={control}
        render={({field}) => {
          return (
            <Input
              secureTextEntry
              placeholder="Password"
              my={2}
              {...field}
              onChangeText={field.onChange}
            />
          );
        }}
      />

      <Button onPress={handleSubmit(handleSignIn)} style={{marginVertical: 16}}>
        <Text color={'white'}>Sign In</Text>
      </Button>

      <Text>Did you forget your pasword?</Text>

      <Button
        variant={'ghost'}
        mb={6}
        onPress={() => {
          navigate('ForgotPassword');
        }}>
        <Text>Reset Password</Text>
      </Button>

      <Button
        variant={'outline'}
        onPress={() => {
          navigate('SignUp');
        }}>
        <Text>Go to Sign Up</Text>
      </Button>
    </View>
  );
};
