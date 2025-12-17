import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function SignUpScreen() {
  const { signup, isLoading } = useAuth();
  const navigation = useNavigation();

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstBook, setFirstBook] = useState("");
  const [firstBookAuthor, setFirstBookAuthor] = useState("");
  const [secondBook, setSecondBook] = useState("");
  const [secondBookAuthor, setSecondBookAuthor] = useState("");
  const [firstStyle, setFirstStyle] = useState("");
  const [secondStyle, setSecondStyle] = useState("");
  const [thirdStyle, setThirdStyle] = useState("");
  const [birth, setBirth] = useState("");
  const [genre, setGenre] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return fullname && username && email.includes("@") && password.length >= 6;
  }, [fullname, username, email, password]);

  const onSubmit = async () => {
    setError("");
    try {
      setSubmitting(true);
      await signup({
        fullname,
        username,
        email,
        password,
        firstBookTitle: firstBook,
        firstBookAuthor,
        secondBookTitle: secondBook,
        secondBookAuthor,
        firstStyle,
        secondStyle,
        thirdStyle,
        birth,
        genre,
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const goToLogin = () => {
    navigation.navigate("login");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Full name"
        value={fullname}
        onChangeText={setFullname}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
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

      <TextInput
        style={styles.input}
        placeholder="First Book Title"
        value={firstBook}
        onChangeText={setFirstBook}
      />
      <TextInput
        style={styles.input}
        placeholder="First Book Author"
        value={firstBookAuthor}
        onChangeText={setFirstBookAuthor}
      />
      <TextInput
        style={styles.input}
        placeholder="Second Book Title"
        value={secondBook}
        onChangeText={setSecondBook}
      />
      <TextInput
        style={styles.input}
        placeholder="Second Book Author"
        value={secondBookAuthor}
        onChangeText={setSecondBookAuthor}
      />

      <TextInput
        style={styles.input}
        placeholder="First Style"
        value={firstStyle}
        onChangeText={setFirstStyle}
      />
      <TextInput
        style={styles.input}
        placeholder="Second Style"
        value={secondStyle}
        onChangeText={setSecondStyle}
      />
      <TextInput
        style={styles.input}
        placeholder="Third Style"
        value={thirdStyle}
        onChangeText={setThirdStyle}
      />

      <TextInput
        style={styles.input}
        placeholder="Birth"
        value={birth}
        onChangeText={setBirth}
      />
      <TextInput
        style={styles.input}
        placeholder="Genre"
        value={genre}
        onChangeText={setGenre}
      />

      <TouchableOpacity
        style={[
          styles.btn,
          (!canSubmit || submitting || isLoading) && { opacity: 0.7 },
        ]}
        onPress={onSubmit}
        disabled={!canSubmit || submitting || isLoading}
      >
        <Text style={styles.btnText}>
          {submitting || isLoading ? "Creating..." : "Create account"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToLogin}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 32,
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
    marginTop: 12,
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
