import { useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { Ionicons } from "@expo/vector-icons";
import { MOCK_BOOKS } from "../../constants/book";
import BookCard from "../../components/BookCard";

export default function HomeIndex() {
  const [isMasked, setIsMasked] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);

  // Fonction appelée quand on swipe une carte
  const onSwiped = (index) => {
    setCardIndex(index + 1);
    setIsMasked(false); // Reset le masque pour la prochaine carte
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Bouton Recherche (Loupe) en haut à droite */}
      <TouchableOpacity style={styles.searchButton}>
        <Ionicons name="search" size={24} color="#D35400" />
      </TouchableOpacity>

      {/* Swiper centré */}
      <View style={styles.swiperContainer}>
        <Swiper
          cards={MOCK_BOOKS}
          renderCard={(card) => (
            <BookCard
              book={card}
              isMasked={isMasked}
              onToggleMask={() => setIsMasked(!isMasked)}
              style={styles.card} // applique le style centré
            />
          )}
          onSwiped={onSwiped}
          onSwipedRight={() => console.log("LIKE -> Wishlist")}
          onSwipedLeft={() => console.log("DISLIKE")}
          cardIndex={cardIndex}
          backgroundColor="transparent"
          stackSize={3}
          cardVerticalMargin={0}
          cardHorizontalMargin={0}
          animateCardOpacity
          swipeBackCard
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  searchButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 100,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  swiperContainer: {
    flex: 1,
    justifyContent: "center", // centre verticalement
    alignItems: "center",     // centre horizontalement
  },
  card: {
    width: 300,       // largeur de la carte
    alignSelf: "center", // centre la carte
  },
});
