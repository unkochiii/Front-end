import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async () => {
    try {
      await login(email, password);
    } catch (e) {
      setError(e.message);
    }
  };

  const goToSignUp = () => {
    navigation.navigate("signup"); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {!!error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.btn, isLoading && { opacity: 0.7 }]}
        onPress={onSubmit}
        disabled={isLoading}
      >
        <Text style={styles.btnText}>
          {isLoading ? "Loading..." : "Sign in"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToSignUp}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 40,
    textAlign: "center",
    color: "#000",
    letterSpacing: -0.5,
  },
  input: {
    backgroundColor: "#F8F8F8",
    borderWidth: 0,
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    fontSize: 16,
    color: "#000",
  },
  btn: {
    backgroundColor: "#FF6B6B",
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#FF6B6B",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  btnText: {
    color: "white",
    fontWeight: "800",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  error: {
    color: "#FF6B6B",
    textAlign: "center",
    marginBottom: 16,
    fontSize: 14,
    fontWeight: "600",
  },
  link: {
    textAlign: "center",
    marginTop: 20,
    color: "#FF6B6B",
    fontWeight: "700",
    fontSize: 15,
  },
});
