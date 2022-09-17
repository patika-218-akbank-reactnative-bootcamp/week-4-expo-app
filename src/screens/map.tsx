import {Button, Image, Text, View} from 'native-base';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet, Alert} from 'react-native';

import MapView, {Marker, Polyline} from 'react-native-maps';

import * as Location from 'expo-location';
import {
  doc,
  getDocs,
  query,
  updateDoc,
  collection,
  where,
} from 'firebase/firestore';
import {db} from '../utils/firebase';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CustomMarker = ({user, lat, long}) => (
  <Marker
    coordinate={{
      latitude: lat,
      longitude: long,
    }}>
    {user.photoURL ? (
      <Image
        borderColor="blue.200"
        w={12}
        h={12}
        rounded="full"
        source={{uri: user.photoURL}}
      />
    ) : (
      <View
        backgroundColor="blue.400"
        w={8}
        h={8}
        rounded="full"
        display={'flex'}
        flexDirection="row"
        alignItems={'center'}
        justifyContent="center">
        <Text color={'white'}>{user.firstName?.[0]}</Text>
      </View>
    )}
  </Marker>
);

const MapScreen = () => {
  const {top} = useSafeAreaInsets();
  const user = useSelector(state => state.auth.user);
  const [users, setUsers] = useState([]);
  const {navigate} = useNavigation();
  const [locations, setLocations] = useState<
    {latitude: number; longitude: number}[]
  >([]);
  const [lastLocation, setLastLocation] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    addNewLocation(lastLocation);
  }, [lastLocation]);

  const getUsers = async () => {
    const q = query(collection(db, 'user'), where('id', '!=', user.id));
    await getDocs(q).then(res => {
      const _users = res.docs.map(item => item.data());
      setUsers(_users);
    });
  };

  const updateUsersCurrentLocation = async location => {
    const docRef = doc(db, 'user', user.id);
    await updateDoc(docRef, {
      currentLocation: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
  };

  const addNewLocation = location => {
    if (location?.coords) {
      const newLocations = [...locations];
      newLocations.push({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      updateUsersCurrentLocation(location);
      setLocations(newLocations);
    }
  };

  const getCurrentLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    let location = await Location.watchPositionAsync(
      {
        distanceInterval: 10,
      },
      location => {
        setLastLocation(location);
        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      },
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View style={{paddingTop: top}}>
      <Button
        position={'absolute'}
        top={12}
        right={12}
        zIndex={888}
        onPress={() => {
          navigate('Profile');
        }}>
        <Text color="white">Profile</Text>
      </Button>
      <MapView
        showsMyLocationButton
        mapType="satellite"
        showsScale
        showsUserLocation
        ref={mapRef}
        style={styles.map}
        minZoomLevel={15}>
        <Polyline coordinates={locations} strokeWidth={6} strokeColor="black" />
        {lastLocation ? (
          <CustomMarker
            user={user}
            lat={lastLocation.coords.latitude}
            long={lastLocation.coords.longitude}
          />
        ) : null}
        {users.map(userItem => {
          return (
            <CustomMarker
              user={userItem}
              lat={userItem.currentLocation.latitude}
              long={userItem.currentLocation.longitude}
            />
          );
        })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
});

export default MapScreen;
