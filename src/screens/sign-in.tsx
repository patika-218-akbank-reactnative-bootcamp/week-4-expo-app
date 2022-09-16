import React from 'react';

import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../utils/firebase';
import {useDispatch, useSelector} from 'react-redux';
import {signIn} from '../utils/store';

import {useNavigation} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import {Button, Input, Text, View} from 'native-base';

export const SignInScreen = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();
  const {navigate} = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const handleSignIn = data => {
    console.log(data);
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(response => {
        console.log(response);
        dispatch(
          signIn({
            email: response.user.email,
            phone: response.user.phoneNumber,
          }),
        );
      })
      .catch(err => {
        console.log(err);
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
