import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import StarRating from "react-native-star-rating-widget";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MagicPortal from "./components/MagicPortal";

export default function BookScreen() {
  const [bookData, setBookData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(4.5); //Note test à changer et à connecter + comparer à la BDD

  const id = "OL29226517W"; // Work ID à changer aussi

  useEffect(() => {
    const fetchBook = async () => {
      try {
        // Fetch Work
        const response = await axios.get(
          `https://openlibrary.org/works/${id}.json`
        );
        const work = response.data;

        // Cover
        let coverUrl = null;
        if (work.covers && work.covers.length > 0) {
          coverUrl = `https://covers.openlibrary.org/b/id/${work.covers[0]}-L.jpg`;
        }

        // Author.s
        let authors = [];
        if (work.authors && work.authors.length > 0) {
          for (let a of work.authors) {
            const authorKey = a.author.key; // ex: "/authors/OL12345A"
            const authorResponse = await axios.get(
              `https://openlibrary.org${authorKey}.json`
            );
            authors.push(authorResponse.data.name);
          }
        }

        // Title and description
        const title = work.title;
        const description =
          work.description?.value ||
          work.description ||
          "No description available.";

        // Stock in BookData
        setBookData({ title, coverUrl, description, authors });
        setIsLoading(false);
      } catch (error) {
        console.log("Error :", error);
      }
    };

    fetchBook();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {bookData.coverUrl && (
          <Image
            source={{ uri: bookData.coverUrl }}
            style={styles.book_picture}
          />
        )}
        <View style={styles.add}>
        <Text style={styles.title}>{bookData.title}</Text>
        <Entypo name="add-to-list" size={24} color="black" />
          <FontAwesome name="heart" size={24} color="black" />
          </View>
        <Text style={styles.author}>{`by ${bookData.authors}`}</Text>
        
          
        
        <View style={styles.rate}>
          <StarRating
            rating={rating}
            onChange={setRating}
            maxStars={5}
            enableHalfStar={true}
            style={styles.stars}
            starSize={20}
            size={4}
          />
          <Text>{rating}</Text>
        </View>

        <MagicPortal size={80} color="#ff0" />
        <Text style={styles.description}>{bookData.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FAFAF0",
  },
  book_picture: {
    width: 200,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  add: { flexDirection: "row", marginVertical: 5 },
  rate: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  stars: {size:5},
  author: { fontSize: 11, color: "black" },
  description: {
    fontSize: 12,
    textAlign: "center",
  },
});
