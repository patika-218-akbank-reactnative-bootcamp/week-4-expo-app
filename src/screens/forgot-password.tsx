import React from 'react';

import {sendPasswordResetEmail} from 'firebase/auth';
import {auth} from '../utils/firebase';
import {useDispatch, useSelector} from 'react-redux';
import {signIn} from '../utils/store';

import {useNavigation} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import {Button, Input, Text, View, useToast} from 'native-base';

export const ForgotPasswordScreen = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();
  const {navigate} = useNavigation();
  const {show} = useToast();

  const handleSignIn = data => {
    sendPasswordResetEmail(auth, data.email)
      .then(response => {
        console.log(response);
        show({
          description:
            'Password reset mail has been sent. Please check your email.',
          backgroundColor: 'green.400',
        });
        navigate('SignIn');
      })
      .catch(err => {
        console.log(err.message);
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

      <Button onPress={handleSubmit(handleSignIn)} style={{marginVertical: 16}}>
        <Text color={'white'}>Reset Password</Text>
      </Button>
    </View>
  );
};
