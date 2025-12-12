import { View, Text, Image, StyleSheet } from "react-native";

export default function OrganisationSubject({ item }) {
    const coverUri = item.cover_id
        ? `https://covers.openlibrary.org/b/id/${item.cover_id}-M.jpg`
        : "https://via.placeholder.com/80x120.png?text=No+Cover";

    return (
        <View style={styles.container}>
            <Image source={{ uri: coverUri }} style={styles.cover} />
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.authors}>{item.authors?.[0]?.name || "Unknown"}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: "row", gap: 12 },
    cover: { width: 60, height: 90, borderRadius: 6 },
    info: { flex: 1, justifyContent: "center" },
    title: { fontSize: 14, fontWeight: "600", color: "#5A2B18" },
    authors: { fontSize: 12, color: "#7A7A7A", marginTop: 4 },
});