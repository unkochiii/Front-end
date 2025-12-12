import { Text, View, Image, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";

const Profile = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await axios.get(
          `https://site--en2versv0-backend--ftkq8hkxyc7l.code.run/user/profile/6939799a4062b44279b19831`,
          {
            headers: {
              Authorization: `Bearer 8NH3VYttUIa6lDQQRORkJT85PSciM0aUrQ6oa-nL_iCgAfQLkUOxwxQkXCguQKD0`,
            },
          }
        );
        setData(results.data);
        console.log(results.data);
      } catch (error) {
        console.log("Error fetching profile:", error);
      }
    };
    fetchData();
  }, []); //rajouter id dans les dépendances
  return (
    <ScrollView>
      {data?.user?.account?.avatar?.secure_url && (
        <Image //regarder s'il existe un avatar par défaut
          source={{ uri: data.user.account.avatar.secure_url }}
          style={styles.avatar}
        />
      )}
      <Text style={styles.username}>{data?.user?.fullname}</Text>
      <Feather name="user-plus" size={24} color="black" style={{alignSelf:"center"}}/>
      <Text style={styles.username}>@{data?.user?.account?.username}</Text>
<Text></Text>
      <View style={styles.bio}>

        <Text>Bio</Text>
      </View>
      <Text>Favorites Books: to complete when library of fav is ready</Text>
      <Text>Favorites Subjects: to complete when library of fav subjects is ready</Text>

      <View>

      </View>
    </ScrollView>
  );
};

export default Profile;
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FAFAF0",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: "50%",
    marginBottom: 10,
    borderRadius: 30,
    alignSelf: "center",
  },
  username: { alignSelf: "center" },
  bio: {
    width: "80%",
    backgroundColor: "brown",
    alignSelf: "center",
    height: "120",
    marginVertical: 20,
    padding:5,
  },
});
