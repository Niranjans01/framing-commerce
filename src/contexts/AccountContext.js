import React, { createContext, useEffect, useState, useContext } from 'react'
import firebase from '../lib/firebase-utilities'
import { accountService } from "../services/AccountService";
import { useCart } from './CartContext';

export const AccountContext = createContext(null);

export function useUser() {
  return useContext(AccountContext);
}

const AccountProvider = (props) => {
  const [user, setUser] = useState(null)
  const [isSignUp, setIsSignUp] = useState(false);
  const {clearCart} = useCart();

  const getUserInfo = async (userId) => {
    return accountService.getUser(userId);
  }

  const loadCurrentUser = (authUser) => {
      getUserInfo(authUser.uid).then((res) => {
        setUser({
          id: authUser.uid,
          email: authUser.email,
          isAdmin: res.isAdmin,
        });
      }).catch(() => {
        setUser({
          id: authUser.uid,
          email: authUser.email,
        });
      })
  };

  useEffect(() => {
    const unsub = firebase.auth().onAuthStateChanged(async authUser => {
      if (authUser) {
        if (isSignUp) {
          setTimeout(() => {
            loadCurrentUser(authUser);
            setIsSignUp(false);
          }, 3000);
        }
        else loadCurrentUser(authUser);
      } else {
        setUser(null);
      }
    });

    // unsubscribe
    return () => unsub();
  }, []);

  const loginWithEmailAndPassword = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  const signupWithEmailAndPassword = (email, password) => {
    setIsSignUp(true);
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  };

  const sendRecoverEmail = (email) => {
    return firebase.auth().sendPasswordResetEmail(email)
  }

  const verifyResetToken = (code) => {
    return firebase.auth().verifyPasswordResetCode(code)
  }
  const resetWithNewPassword = (code,email) => {
    return firebase.auth().confirmPasswordReset(code,email)
  }

  const signout = () => {
    console.log("Thank you user, visit again")
    clearCart();
    return firebase.auth().signOut()
  }

  const changePassword = async (user, email, currentPassword, newPassword) => {
    const currentUser = firebase.auth().currentUser
    const credentials = firebase.auth.EmailAuthProvider.credential(
      email,
      currentPassword
    );
    await currentUser.reauthenticateWithCredential(credentials).catch(err=>console.error(err));
    return currentUser.updatePassword(newPassword);
  };

  return (
    <AccountContext.Provider
      value={{
        user,
        loginWithEmailAndPassword,
        signupWithEmailAndPassword,
        signout,
        changePassword,
        sendRecoverEmail,
        verifyResetToken,
        resetWithNewPassword
      }}
    >
      {props.children}
    </AccountContext.Provider>
  );
}

export default AccountProvider
