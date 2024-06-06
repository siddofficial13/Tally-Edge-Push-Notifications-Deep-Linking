import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function getUserTokenByEmail(email) {
  try {
    const userQuerySnapshot = await firestore()
      .collection('Users')
      .where('email', '==', email)
      .get();

    if (!userQuerySnapshot.empty) {
      const userDoc = userQuerySnapshot.docs[0];
      const userData = userDoc.data();
      console.log('UserData', userData);
      return userData.token;
    } else {
      console.log('No user found with email:', email);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user token:', error);
    return null;
  }
}

const sendLikeNotification = async email => {
  try {
    const token = await getUserTokenByEmail(email);
    // if (!userData) {
    //   console.error('No token found for email:', email);
    //   return;
    // }
    // const {token} = userData;
    await fetch(
      'https://carroll-hint-barrier-connectivity.trycloudflare.com/send-like-notifications',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
        }),
      },
    );
  } catch (error) {
    console.log('Error in single device notification:', error);
  }
};

const HomeTab = () => {
  const [postData, setPostData] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      getData();
    }
  }, [userId]);

  useEffect(() => {
    console.log('Post data updated:', postData);
  }, [postData]);

  const getUserId = async () => {
    const id = await AsyncStorage.getItem('USERID');
    setUserId(id);
  };

  const getData = () => {
    firestore()
      .collection('Posts')
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          postId: doc.id,
        }));
        console.log('Fetched data:', data);
        setPostData(data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  };

  const getLikeStatus = likes => {
    return likes.includes(userId);
  };

  const onLike = async item => {
    console.log('onLike called for item:', item);

    let tempLikes = [...item.likes];
    const userIndex = tempLikes.indexOf(userId);
    let isLiked = false;

    if (userIndex > -1) {
      console.log('Unliking the post');
      tempLikes.splice(userIndex, 1);
    } else {
      console.log('Liking the post');
      tempLikes.push(userId);
      isLiked = true;
    }

    try {
      await firestore().collection('Posts').doc(item.postId).update({
        likes: tempLikes,
      });

      console.log('Firestore updated successfully');

      if (isLiked) {
        await sendLikeNotification(item.email);
        console.log('Notification sent');
      }

      setPostData(prevPostData => {
        const updatedPostData = prevPostData.map(post =>
          post.postId === item.postId ? {...post, likes: tempLikes} : post,
        );
        console.log('Updated post data:', updatedPostData);
        return updatedPostData;
      });
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const renderPostItem = ({item}) => (
    <View style={styles.postContainer}>
      <Text style={styles.author}>{item.name}</Text>
      <Text style={styles.postTitle}>{item.postTitle}</Text>
      <Text style={styles.postDescription}>{item.postDescription}</Text>
      <Text style={styles.postCaption}>{item.postCaption}</Text>
      <TouchableOpacity
        style={styles.likeContainer}
        onPress={() => {
          onLike(item);
        }}>
        <Image
          source={
            getLikeStatus(item.likes)
              ? require('../assets/heartred.png')
              : require('../assets/heart.png')
          }
          style={styles.likeButton}
        />
        <Text style={styles.likeCount}>{item.likes.length}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Firebase Social Media</Text>
      </View>
      <View style={{flex: 1}}>
        <FlatList
          data={postData}
          renderItem={renderPostItem}
          keyExtractor={item => item.postId}
          contentContainerStyle={styles.postList}
        />
      </View>
      <View style={styles.bottomComponent}>
        {/* Add your bottom component here */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  banner: {
    backgroundColor: '#007BFF',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  bannerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  postList: {
    paddingHorizontal: 10,
    paddingBottom: 16,
  },
  postContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    padding: 15,
  },
  author: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postDescription: {
    fontSize: 16,
    marginBottom: 5,
  },
  postCaption: {
    fontSize: 14,
    color: '#666',
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  likeButton: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  likeCount: {
    fontSize: 16,
  },
  bottomComponent: {
    height: 100,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeTab;
