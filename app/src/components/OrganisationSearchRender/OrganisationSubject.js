import { View, Text, StyleSheet, Image } from "react-native";

const OrganisationSubject = ({ item }) => {
  const coverUri = item.cover_id
    ? `https://covers.openlibrary.org/b/id/${item.cover_id}-M.jpg`
    : "https://via.placeholder.com/100x150.png?text=No+Cover";

  return (
    <View style={styles.container}>
      <Image source={{ uri: coverUri }} style={styles.cover} />

      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>

        {item.authors && (
          <Text style={styles.text}>
            Author: {item.authors.map((a) => a.name).join(", ")}
          </Text>
        )}

        {item.first_publish_year && (
          <Text style={styles.text}>Year: {item.first_publish_year}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
  },
  cover: {
    width: 80,
    height: 120,
    borderRadius: 6,
    backgroundColor: "#EEE",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 16,
  },
  text: {
    fontSize: 14,
    marginTop: 2,
  },
});

export default OrganisationSubject;
