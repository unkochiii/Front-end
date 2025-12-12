import { View, Text, StyleSheet,Image } from "react-native";

const OrganisationISBN = ({ item }) => {
  return (
    <>
      <Text style={styles.title}>{item.title}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ paddingRight: 5 }}>
          <Text>
            Author:{" "}
            {item.authors && item.authors.length > 0
              ? item.authors[0].name
              : "Unknown"}
          </Text>
          <Text>Year: {item.publish_date || "Unknown"}</Text>
        </View>
        {item.cover?.large && (
          <Image
            source={{ uri: item.cover.large }}
            style={styles.book_picture}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: { fontWeight: "bold", marginBottom: 4 },
  book_picture: { width: 100, height: 150, resizeMode: "cover", marginTop: 8 },
});

export default OrganisationISBN;
