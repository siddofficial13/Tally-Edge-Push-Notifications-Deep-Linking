/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable react-native/no-inline-styles */

import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from './MainNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import notificationRestApi from '../utils/notificationRestApi.js';
import firestore from '@react-native-firebase/firestore';
type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
const emailid = 'siddharth@gmail.com';
async function getUserTokenByEmail(x) {
  try {
    const userQuerySnapshot = await firestore()
      .collection('Users')
      .where('email', '==', x)
      .get();
    if (!userQuerySnapshot.empty) {
      const userDoc = userQuerySnapshot.docs[0];
      const userData = userDoc.data();
      return userData.token; // Assuming the token is stored under a field called 'token'
    } else {
      console.log('No user found with email:', x);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user token:', error);
    return null;
  }
}
const item = {
  id: 'Welcome to the Social App',
};
const sendNotification = async () => {
  try {
    await fetch(
      'https://carroll-hint-barrier-connectivity.trycloudflare.com/send-notifications',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: await getUserTokenByEmail(emailid),
        }),
      },
    );
  } catch (error) {
    console.log('Error in single device notification:', error);
  }
};
const Home = ({navigation}: HomeProps) => {
  //   const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.text1}>Firebase</Text>
      <Text style={styles.text2}>The Social App</Text>
      <Button
        title="Go to Details page"
        onPress={() => {
          navigation.navigate('Details');
        }}
      />
      <View style={styles.button}>
        <Button
          title="Get the notification and go to the details page"
          onPress={() => {
            sendNotification();
          }}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    fontSize: 40,
    fontWeight: '800',
    color: '#000',
  },
  text2: {
    fontSize: 25,
    fontWeight: '800',
    color: '#3498DB',
    marginVertical: 5,
  },
  button: {
    marginVertical: 10,
  },
});
