import {useNavigation} from '@react-navigation/native';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {setDoc, doc} from 'firebase/firestore';
import {Button, Input, Pressable, Text, View} from 'native-base';
import {Controller, useForm} from 'react-hook-form';
import {auth, db} from '../utils/firebase';

export const SignUpScreen = () => {
  const {control, handleSubmit} = useForm();
  const {navigate} = useNavigation();

  const handleSignUp = data => {
    console.log(data);
    createUserWithEmailAndPassword(auth, data.email, data.password).then(
      async response => {
        await setDoc(doc(db, `user`, response.user.uid), {
          email: response.user.email,
          photoURL: response.user.photoURL,
          id: response.user.uid,
        });
        navigate('SignIn');
      },
    );
  };

  return (
    <View p={4}>
      <Controller
        control={control}
        name="email"
        render={({field}) => {
          return (
            <Input
              placeholder="E-mail"
              {...field}
              my={2}
              onChangeText={field.onChange}
            />
          );
        }}
      />
      <Controller
        control={control}
        name="password"
        render={({field}) => (
          <Input
            placeholder="Password"
            {...field}
            my={2}
            onChangeText={field.onChange}
            secureTextEntry={true}
          />
        )}
      />

      <Button my={2} onPress={handleSubmit(handleSignUp)}>
        <Text color={'white'}>Sign Up</Text>
      </Button>
    </View>
  );
};
