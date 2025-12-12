import { View, Text, Image, StyleSheet } from "react-native";

const OrganisationTitle = ({ title, authors, year, coverUri }) => {
  const finalCover =
    coverUri || "https://via.placeholder.com/100x150.png?text=No+Cover";

  return (
    <View style={styles.container}>
      <Image source={{ uri: finalCover }} style={styles.cover} />

      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>

        {authors && <Text style={styles.text}>Author: {authors}</Text>}

        {year && <Text style={styles.text}>Year: {year}</Text>}
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

export default OrganisationTitle;
