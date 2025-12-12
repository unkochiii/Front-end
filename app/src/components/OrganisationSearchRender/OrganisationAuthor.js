import { View, Text,StyleSheet } from "react-native";

const OrganisationAuthor = ({ item }) => {
  return (
    <>
      <Text style={styles.title}>{item.name}</Text>
      {item.topSubjects?.length > 0 && (
        <View>
          <Text>Top Subjects:</Text>
          {item.topSubjects.map((subj, idx) => (
            <Text key={idx}>• {subj}</Text>
          ))}
        </View>
      )}
      <Text style={{ marginTop: 6 }}>
        Number of Books: {item.numberOfBooks}
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  title: { fontWeight: "bold", marginBottom: 4 },
});

export default OrganisationAuthor;
