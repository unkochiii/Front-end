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
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import DropDownPicker from "react-native-dropdown-picker";
import OrganisationTitle from "../../../../components/OrganisationSearchRender/OrganisationTitle";
import OrganisationAuthor from "../../../../components/OrganisationSearchRender/OrganisationAuthor";
import OrganisationISBN from "../../../../components/OrganisationSearchRender/OrganisationISBN";
import OrganisationSubject from "../../../../components/OrganisationSearchRender/OrganisationSubject";

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

  // States spécifiques pour sujet
  const [books, setBooks] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  const dropdownRef = useRef(null);

  // Reset des livres quand le search ou type change
// -----------------------------
// LOGIQUE PRINCIPALE DE RECHERCHE
// -----------------------------
useEffect(() => {
  // Si champ vide → reset total
  if (!search.trim()) {
    setData([]);
    setBooks([]);
    setOffset(0);
    setHasMore(true);
    setIsLoading(false);
    return;
  }

  // -----------------------------
  // TITLE / AUTHOR / ISBN
  // -----------------------------
  const fetchOtherTypes = async () => {
    setIsLoading(true);
    try {
      if (type === "title") {
        const res = await axios.get(
          `https://openlibrary.org/search.json?title=${encodeURIComponent(search)}`
        );
        setData(res.data.docs || []);
      }

      else if (type === "author") {
        const resAuthor = await axios.get(
          `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(search)}`
        );
        const author = resAuthor.data?.docs?.[0];

        if (!author) {
          setData([{ name: "No author found", topSubjects: [], numberOfBooks: 0 }]);
          setIsLoading(false);
          return;
        }

        const authorKey = author.key.replace(/^\/+/, "");
        const worksRes = await axios.get(
          `https://openlibrary.org/authors/${authorKey}/works.json`
        );
        const numberOfBooks = worksRes.data?.size;

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

      else if (type === "ISBN") {
        const ISBNKey = `ISBN:${search}`;
        const res = await axios.get(
          `https://openlibrary.org/api/books?bibkeys=${ISBNKey}&format=json&jscmd=data`
        );
        const bookKey = Object.keys(res.data)[0];
        setData(bookKey ? [res.data[bookKey]] : []);
      }

    } catch (error) {
      console.error("API Error:", error);
      setData([]);
    }

    setIsLoading(false);
  };

  // -----------------------------
  // SUBJECT
  // -----------------------------
  const fetchSubjectFirstPage = async () => {
    // Reset avant de charger la première page
    setBooks([]);
    setOffset(0);
    setHasMore(true);
    setIsLoading(true);

    try {
      const res = await axios.get(
        `https://openlibrary.org/subjects/${encodeURIComponent(
          search
        )}.json?limit=${limit}&offset=0`
      );

      setBooks(res.data.works || []);
      setOffset(limit);

      if ((res.data.works || []).length >= res.data.work_count) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("API Error Subject:", error);
      setBooks([]);
    }

    setIsLoading(false);
  };

  // -----------------------------
  // CHOIX DU TYPE
  // -----------------------------
  if (type === "subject") {
    fetchSubjectFirstPage();
  } else {
    fetchOtherTypes();
  }
}, [search, type]);


// -----------------------------
// SCROLL INFINI POUR SUBJECT
// -----------------------------
const fetchBooks = async () => {
  if (!hasMore) return;

  try {
    setIsLoading(true);
    const res = await axios.get(
      `https://openlibrary.org/subjects/${encodeURIComponent(
        search
      )}.json?limit=${limit}&offset=${offset}`
    );

    const newBooks = res.data.works || [];
    setBooks((prev) => [...prev, ...newBooks]);
    setOffset((prev) => prev + limit);

    if (books.length + newBooks.length >= res.data.work_count) {
      setHasMore(false);
    }
  } catch (error) {
    console.error("API Error Subject:", error);
  }

  setIsLoading(false);
};


  // -----------------------------
  // FETCH pour sujets (scroll infini)
  // -----------------------------

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    setOpen(false);
  };

  // -----------------------------
  // Rendu
  // -----------------------------
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

        {(type !== "subject" || !search) && isLoading && (
          <ActivityIndicator
            size="large"
            color="black"
            style={{ marginTop: 20 }}
          />
        )}

        <FlatList
          data={type === "subject" ? books : data}
          keyExtractor={(item, index) =>
            (item?.key || item?.cover_edition_key || index).toString()
          }
          renderItem={({ item }) => {
            // Variables génériques pour Title / Subject
            const title = item.title || "No Title";
            const authors = item.author_name?.join(", ") || "Unknown";
            const year = item.first_publish_year || "Unknown";
            const coverUri = item.cover_i
              ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
              : "https://via.placeholder.com/100x150.png?text=No+Cover";

            return (
              <View style={styles.resultItem}>
                {/* TITLE */}
                {type === "title" && (
                  <OrganisationTitle
                    title={title}
                    authors={authors}
                    year={year}
                    coverUri={coverUri}
                  />
                )}

                {/* AUTHOR */}
                {type === "author" && <OrganisationAuthor item={item} />}

                {/* ISBN */}
                {type === "ISBN" && item && <OrganisationISBN item={item} />}

                {/* SUBJECT */}
                {type === "subject" && <OrganisationSubject item={item} />}
              </View>
            );
          }}
          onEndReached={type === "subject" ? fetchBooks : null}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingBottom: 120 }}
          style={{ marginTop: 12 }}
        />

        {isLoading && type === "subject" && (
          <ActivityIndicator
            size="large"
            color="black"
            style={{ marginTop: 20 }}
          />
        )}
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
