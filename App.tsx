import React, { useState } from "react";
import {
  Button,
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Text,
} from "react-native";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react-native";
import outputs from "./amplify_outputs.json";
import {
  confirmSignIn,
  confirmSignUp,
  signIn,
  signOut,
  signUp,
} from "aws-amplify/auth";
Amplify.configure(outputs);

const OTPAuth = () => {
  const [email, setEmail] = useState("");
  const [askOtp, setAskOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("signUp");
  const [error, setError] = useState("");

  const signUpInitial = async () => {
    console.log(email);
    try {
      const { nextStep: signUpNextStep } = await signUp({
        username: email,
        options: {
          userAttributes: {
            email: email,
          },
        },
      });
      if (signUpNextStep.signUpStep === "CONFIRM_SIGN_UP") {
        setAskOtp(true);
      }
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };

  const signUpOtp = async () => {
    try {
      const { nextStep: confirmSignUpNextStep } = await confirmSignUp({
        confirmationCode: otp,
        username: email,
      });

      console.log(confirmSignUpNextStep);
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };
  const signInOtp = async () => {
    try {
      const { nextStep: confirmSignUpNextStep } = await confirmSignIn({
        challengeResponse: otp,
      });

      console.log(confirmSignUpNextStep);
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };

  const signInInitial = async () => {
    try {
      const { nextStep: signUpNextStep } = await signIn({
        username: email,
        options: {
          authFlowType: "USER_AUTH",
          preferredChallenge: "EMAIL_OTP",
        },
      });
      console.log(signUpNextStep);
      if (signUpNextStep.signInStep === "CONFIRM_SIGN_IN_WITH_EMAIL_CODE") {
        setAskOtp(true);
      }
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };

  return (
    <View>
      {!askOtp && (
        <>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
          />
          <Button title="Sign Up" onPress={signUpInitial} />
          <Button title="Sign In" onPress={signInInitial} />
        </>
      )}
      {askOtp && (
        <>
          <TextInput
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
            placeholder="OTP"
          />
          <Button title="Sign Up with OTP" onPress={signUpOtp} />
          <Button title="Sign In with OTP" onPress={signInOtp} />
        </>
      )}
      <Button
        title="Sign Out"
        onPress={() => {
          signOut();
          setAskOtp(false);
        }}
      />
    </View>
  );
};
const App = () => {
  return <OTPAuth />;
};

export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  error: {
    color: "red",
    marginTop: 12,
  },
});
