import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import axios from "axios";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import DropDownPicker from "react-native-dropdown-picker";

export default function Search() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [items, setItems] = useState([
    { label: "Title", value: "title" },
    { label: "Author", value: "author" },
    { label: "Subject", value: "subject" },
    { label: "ISBN", value: "ISBN" },
  ]);

  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!search.trim()) {
      setData([]);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);

      try {
        // -----------------------------
        // TITLE
        // -----------------------------
        if (type === "title") {
          const res = await axios.get(
            `https://openlibrary.org/search.json?title=${encodeURIComponent(
              search
            )}`
          );
          setData(res.data.docs || []);
        }

        // -----------------------------
        // SUBJECT
        // -----------------------------
        else if (type === "subject") {
          const res = await axios.get(
            `https://openlibrary.org/subjects/${encodeURIComponent(
              search
            )}.json`
          );
          setData(res.data.works || []);
        }

        // -----------------------------
        // AUTHOR
        // -----------------------------
        else if (type === "author") {
          const resAuthor = await axios.get(
            `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(
              search
            )}`
          );
          const author = resAuthor.data?.docs?.[0];

          if (!author) {
            setData([
              { name: "No author found", topSubjects: [], numberOfBooks: 0 },
            ]);
            setIsLoading(false);
            return;
          }

          const authorKey = author.key.replace(/^\/+/, "");
          const worksRes = await axios.get(
            `https://openlibrary.org/${authorKey}/works.json`
          );
          const numberOfBooks = worksRes.data?.entries?.length || 0;

          setData([
            {
              name: author.name,
              topSubjects: author.top_subjects || [],
              numberOfBooks,
              photo: author.photo_id
                ? `https://covers.openlibrary.org/a/id/${author.photo_id}-M.jpg`
                : null,
            },
          ]);
        }

        // -----------------------------
        // ISBN
        // -----------------------------
        else if (type === "ISBN") {
          const res = await axios.get(
            `https://openlibrary.org/isbn/${search}.json`
          );
          setData([res.data]);
        }
      } catch (error) {
        console.error("API Error:", error);
        setData([]);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [search, type]);

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    setOpen(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Link href="/">
            <Ionicons name="chevron-back-outline" size={28} color="black" />
          </Link>
          <Text style={styles.headerTitle}>Research</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.dropdownContainer}>
            <DropDownPicker
              ref={dropdownRef}
              open={open}
              value={type}
              items={items}
              setOpen={setOpen}
              setValue={setType}
              setItems={setItems}
              placeholder="Type"
              zIndex={3000}
              zIndexInverse={1000}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropDownContainerStyle}
            />
          </View>

          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="books, ISBN, author ..."
            returnKeyType="search"
            onFocus={() => setOpen(false)}
          />
        </View>

        <FlatList
          data={data}
          keyExtractor={(item, index) =>
            (item.key || item.cover_edition_key || index).toString()
          }
          renderItem={({ item }) => {
            const title = item.title || "No Title";
            const authors =
              item.author_name && item.author_name.length > 0
                ? item.author_name.join(", ")
                : "Unknown";
            const year = item.first_publish_year || "Unknown";
            const coverUri = item.cover_i
              ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
              : "https://via.placeholder.com/100x150.png?text=No+Cover";

            return (
              <View style={styles.resultItem}>
                {type === "title" && (
                  <>
                    <Text style={styles.title}>{title}</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ paddingRight: 5 }}>
                        <Text>Author: {authors}</Text>
                        <Text>Year: {year}</Text>
                      </View>
                      <Image
                        source={{ uri: coverUri }}
                        style={styles.book_picture}
                      />
                    </View>
                  </>
                )}

                {type === "author" && (
                  <>
                    <Text style={styles.title}>{item.name}</Text>
                    {item.topSubjects?.length > 0 && (
                      <View>
                        <Text>Top Subjects:</Text>
                        {item.topSubjects.map((subj, index) => (
                          <Text key={index}>• {subj}</Text>
                        ))}
                      </View>
                    )}
                    <Text style={{ marginTop: 6 }}>
                      Number of Books: {item.numberOfBooks}
                    </Text>
                  </>
                )}

                {type === "subject" && (
                  <>
                    <Text style={styles.title}>{title}</Text>
                    {item.subject && item.subject.length > 0 && (
                      <Text>Subject: {item.subject.join(", ")}</Text>
                    )}
                    {authors !== "Unknown" && <Text>Author: {authors}</Text>}
                    {year !== "Unknown" && <Text>Year: {year}</Text>}
                  </>
                )}
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: 120 }}
          style={{ marginTop: 12 }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FAFAF0" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  headerTitle: { fontSize: 18, marginLeft: 8, fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  dropdownContainer: {
    width: 120,
    ...Platform.select({ ios: { zIndex: 3000 }, android: {} }),
  },
  dropdown: {
    borderColor: "#ccc",
    height: 44,
    justifyContent: "center",
    backgroundColor: "white",
  },
  dropDownContainerStyle: { borderColor: "#ccc", backgroundColor: "white" },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "white",
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "white",
  },
  title: { fontWeight: "bold", marginBottom: 4 },
  book_picture: { width: 100, height: 150, resizeMode: "cover", marginTop: 8 },
});
