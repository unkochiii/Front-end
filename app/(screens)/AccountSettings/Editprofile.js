import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../../context/AuthContext";

export default function EditProfile() {
  const router = useRouter();
  const { user, token } = useAuth();

  const BACKEND_URL = "https://site--en2versv0-backend--ftkq8hkxyc7l.code.run";

  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  // USER INFO
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const [firstBookTitle, setFirstBookTitle] = useState("");
  const [firstBookAuthor, setFirstBookAuthor] = useState("");
  const [secondBookTitle, setSecondBookTitle] = useState("");
  const [secondBookAuthor, setSecondBookAuthor] = useState("");

  const [firstStyle, setFirstStyle] = useState("");
  const [secondStyle, setSecondStyle] = useState("");
  const [thirdStyle, setThirdStyle] = useState("");

  const [birth, setBirth] = useState("");
  const [genre, setGenre] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  if (!user) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /* ===================== AVATAR ===================== */

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      uploadAvatar(result.assets[0]);
    }
  };

  const uploadAvatar = async (image) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", {
        uri: image.uri,
        name: "avatar.jpg",
        type: "image/jpeg",
      });

      const response = await fetch(`${BACKEND_URL}/user/avatar/${user._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        Alert.alert("Error", data.message);
        return;
      }

      Alert.alert("Success", "Avatar updated !");
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Avatar upload failed");
    }
  };

  /* ===================== UPDATE PROFILE ===================== */

  const updateProfile = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${BACKEND_URL}/user/${user._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // type de format envoyé
        },
        body: JSON.stringify({
          fullname,
          email,
          description,
          firstBookTitle,
          firstBookAuthor,
          secondBookTitle,
          secondBookAuthor,
          firstStyle,
          secondStyle,
          thirdStyle,
          birth,
          genre,
          country,
          city,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        Alert.alert("Error", data.message);
        return;
      }

      Alert.alert("Success", "Profile updated successfully!");
      setOpenForm(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Update failed");
    }
  };

  /* ===================== UI ===================== */

  return (
    <ScrollView style={styles.container}>
      {/* BACK */}
      <TouchableOpacity onPress={() => router.back()} style={styles.goBack}>
        <Entypo name="chevron-left" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Edit Profile</Text>

      {/* OPEN FORM */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => setOpenForm(!openForm)}
      >
        <Text style={styles.cardText}>
          {openForm ? "Close profile editor" : "Edit profile information"}
        </Text>
      </TouchableOpacity>

      {openForm && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Full name"
            value={fullname}
            onChangeText={setFullname}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <TextInput
            style={styles.input}
            placeholder="Favorite book #1 title"
            value={firstBookTitle}
            onChangeText={setFirstBookTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Favorite book #1 author"
            value={firstBookAuthor}
            onChangeText={setFirstBookAuthor}
          />

          <TextInput
            style={styles.input}
            placeholder="Favorite book #2 title"
            value={secondBookTitle}
            onChangeText={setSecondBookTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Favorite book #2 author"
            value={secondBookAuthor}
            onChangeText={setSecondBookAuthor}
          />

          <TextInput
            style={styles.input}
            placeholder="Style 1"
            value={firstStyle}
            onChangeText={setFirstStyle}
          />
          <TextInput
            style={styles.input}
            placeholder="Style 2"
            value={secondStyle}
            onChangeText={setSecondStyle}
          />
          <TextInput
            style={styles.input}
            placeholder="Style 3"
            value={thirdStyle}
            onChangeText={setThirdStyle}
          />

          <TextInput
            style={styles.input}
            placeholder="Birth year"
            value={birth}
            onChangeText={setBirth}
          />
          <TextInput
            style={styles.input}
            placeholder="Genre"
            value={genre}
            onChangeText={setGenre}
          />
          <TextInput
            style={styles.input}
            placeholder="Country"
            value={country}
            onChangeText={setCountry}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={updateProfile}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveText}>Save changes</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {/* AVATAR */}
      <TouchableOpacity
        style={[styles.card, loading && { opacity: 0.6 }]}
        onPress={pickImage}
        disabled={loading}
      >
        <Text style={styles.cardText}>Change avatar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
    paddingTop: 60,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  goBack: {
    
    
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 25,
    color: "#333",
  },
  card: {
    backgroundColor: "#FFF",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 15,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  saveBtn: {
    backgroundColor: "#333",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 20,
    alignItems: "center",
  },
  saveText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
