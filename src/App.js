import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  });
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignInBtn = () => {
    firebase.auth().signInWithPopup(provider).then(res => {
      const {displayName, email, photoURL} = res.user;
      const singedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      };
      setUser(singedInUser);
      console.log(displayName, email, photoURL);
    }).catch(error => {
      console.log(error);
      console.log(error.message);
    })
  }

  const handleSignOutBtn = () => {
    firebase.auth().signOut().then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        password: '',
        error: '',
        isValid: false,
        existingUser: false
      };
      setUser(signedOutUser);
    }).catch( error => {
      
    })
  }

  const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input);

  const switchForm = (e) => {
    if(user.isValid){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      }).catch(error => {
        console.log(error.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = error.message;
        setUser(createdUser);
      })
    }
    const createdUser = {...user};
    createdUser.existingUser = e.target.checked;
    createdUser.error = '';
    setUser(createdUser);
  }

  const handleChange = (e) => {
    const newUserInfo = {
      ...user
    };
    // perform Validation
    let isValid = true;
    if(e.target.name === 'email'){
      isValid = is_valid_email(e.target.value);
    }
    if(e.target.name === "password"){
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }
    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }

  const createAccount = (e) => {
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      }).catch(error => {
        console.log(error.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = error.message;
        setUser(createdUser);
      })
    }
    // else{
    //   console.log("From is not valid", user);
    // }
    e.preventDefault();
    e.target.reset();
  }

  const signInUser = (e) => {
    e.preventDefault();
    e.target.reset();
  }
  return (
    <div className="App">
      {user.isSignedIn ? <button onClick={handleSignOutBtn}>Sign Out</button> :
        <button onClick={handleSignInBtn}>Sign In</button>
      }
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
      <h1>Our Authentication</h1>
      <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/>
      <label htmlFor="switchForm"> Returning User</label>
      <form style = {{display:user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
        <input type="text" onBlur={handleChange} name="email" placeholder="Your Email" required/>
        <br/>
        <input onBlur={handleChange}  type="password" name="password" placeholder="Your Password" required/>
        <br/>
        <input type="submit" value="signIn"/>
      </form>
      <form style = {{display:user.existingUser ? 'none' : 'block'}} onSubmit={createAccount}>
        <input type="text" onBlur={handleChange} name="name" placeholder="Your Name" required/>
        <br/>
        <input type="text" onBlur={handleChange} name="email" placeholder="Your Email" required/>
        <br/>
        <input onBlur={handleChange}  type="password" name="password" placeholder="Your Password" required/>
        <br/>
        <input type="submit" value="Create Account"/>
      </form>
      {
        user.error && <p style={{color: 'red'}}>{user.error}</p>
      }
    </div>
  );
}

export default App;
