import "react-native-gesture-handler";

import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import { signIn, store } from "../utils/store";

const storeState = store.getState();

import {
  NavigationContainer,
  useNavigation,
  CompositeNavigationProp,
} from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { useForm, Controller } from "react-hook-form";

const MainStack = createStackNavigator();

const SignUpScreen = () => {
  const { control, watch, handleSubmit } = useForm();
  const { navigate } = useNavigation();

  const handleSignUp = (data) => {
    console.log(data);
    createUserWithEmailAndPassword(auth, data.email, data.password).then(
      (response) => {
        navigate("SignIn");
      }
    );
  };

  return (
    <View style={{ width: "100%", flex: 1 }}>
      <Text>SignUp</Text>
      {/* <Text>email value: {watch("email")}</Text> */}

      <Controller
        control={control}
        name="email"
        render={({ field }) => {
          return (
            <TextInput
              {...field}
              onChangeText={field.onChange}
              style={{
                backgroundColor: "rgba(0,0,0,0.1)",
                padding: 8,
                width: 200,
              }}
            />
          );
        }}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <TextInput
            {...field}
            onChangeText={field.onChange}
            style={{
              backgroundColor: "rgba(0,0,0,0.1)",
              padding: 8,
              width: 200,
            }}
          />
        )}
      />

      <Pressable onPress={handleSubmit(handleSignUp)}>
        <Text>Sign Up</Text>
      </Pressable>
    </View>
  );
};

const SignInScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleSignIn = (data) => {
    console.log(data);
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((response) => {
        console.log(response);
        dispatch(
          signIn({
            email: response.user.email,
            phone: response.user.phoneNumber,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View>
      {user ? <Text>Welcome {user.email}</Text> : <Text>SignIn</Text>}
      <Controller
        name="email"
        control={control}
        rules={{
          required: { value: true, message: "Email is required" },
          minLength: { value: 10, message: "Email can be at least 10 chars. " },
        }}
        render={({ field }) => {
          return (
            <TextInput
              {...field}
              onChangeText={field.onChange}
              style={{
                backgroundColor: "rgba(0,0,0,0.1)",
                padding: 8,
                width: 200,
              }}
            />
          );
        }}
      />
      {errors.email ? (
        <Text style={{ color: "red" }}>{errors.email.message}</Text>
      ) : null}

      <Controller
        name="password"
        control={control}
        render={({ field }) => {
          return (
            <TextInput
              {...field}
              onChangeText={field.onChange}
              style={{
                backgroundColor: "rgba(0,0,0,0.1)",
                padding: 8,
                width: 200,
              }}
            />
          );
        }}
      />

      <Pressable onPress={handleSubmit(handleSignIn)}>
        <Text>Sign In</Text>
      </Pressable>

      <Pressable
        onPress={() => {
          navigate("SignUp");
        }}
      >
        <Text>Go to Sign Up</Text>
      </Pressable>
    </View>
  );
};

const SignUp = () => {
  const handleSignUp = () => {
    // createUserWithEmailAndPassword(auth, email, password).then(
    //   (response) => {}
    // );
  };

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <NavigationContainer>
        <MainStack.Navigator>
          <MainStack.Screen name="SignIn" component={SignInScreen} />
          <MainStack.Screen name="SignUp" component={SignUpScreen} />
        </MainStack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default SignUp;
