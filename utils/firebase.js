const firebase = require('firebase/app');
require('firebase/storage');

var firebaseConfig = {
  apiKey: 'AIzaSyD3P7J_ytQFsp4zqn8Nogvm64calM14hYM',
  authDomain: 'mind-app-file-storage.firebaseapp.com',
  databaseURL: 'https://mind-app-file-storage.firebaseio.com',
  projectId: 'mind-app-file-storage',
  storageBucket: 'mind-app-file-storage.appspot.com',
  messagingSenderId: '927246009169',
  appId: '1:927246009169:web:86e6ad8cf17502a1394970',
};

// Initialize Firebase
module.exports = firebase.initializeApp(firebaseConfig);
