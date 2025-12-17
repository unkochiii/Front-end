import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import api from "../../../services/api";
import StarRating from "react-native-star-rating-widget";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

// ================================
// utils (inline for simplicity)
// ================================
const normalizeBookKey = (key) => {
    if (!key) return null;
    return key.startsWith("/works/") ? key : `/works/${key}`;
};

const stripBookKey = (key) => key?.replace("/works/", "");

export default function BookScreen() {
    const { bookKey: rawBookKey } = useLocalSearchParams();
    const scrollRef = useRef(null);

    const bookKey = normalizeBookKey(decodeURIComponent(rawBookKey));
    const workId = stripBookKey(bookKey);

    const [loading, setLoading] = useState(true);
    const [bookData, setBookData] = useState(null);
    const [rating, setRating] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [sendingRating, setSendingRating] = useState(false);
    const [error, setError] = useState(null);

    // ================================
    // FETCH DATA (✅ await inside useEffect)
    // ================================
    useEffect(() => {
        let mounted = true;

        const fetchAll = async () => {
            try {
                setLoading(true);

                // OpenLibrary (public)
                const workRes = await axios.get(
                    `https://openlibrary.org/works/${workId}.json`
                );

                // Backend (token auto via api) - graceful degradation on failures
                const backendCalls = await Promise.allSettled([
                    api.get(`/reviews/book/${encodeURIComponent(bookKey)}/stats`),
                    api.get(`/reviews/book?bookKey=${encodeURIComponent(bookKey)}`),
                    api.get(`/excerpt/book/${encodeURIComponent(bookKey)}`),
                    api.get(`/deepdive/book/${encodeURIComponent(bookKey)}`),
                ]);

                const [statsRes, reviewsRes, excerptsRes, deepRes] = backendCalls.map(
                    (result) => (result.status === 'fulfilled' ? result.value : null)
                );

                // Authors
                const authors = [];
                if (workRes.data.authors) {
                    for (const a of workRes.data.authors) {
                        const res = await axios.get(
                            `https://openlibrary.org${a.author.key}.json`
                        );
                        authors.push(res.data.name);
                    }
                }

                if (!mounted) return;

                setBookData({
                    title: workRes.data.title,
                    description:
                        workRes.data.description?.value ||
                        workRes.data.description ||
                        "No description available.",
                    authors,
                    coverUrl: workRes.data.covers?.length
                        ? `https://covers.openlibrary.org/b/id/${workRes.data.covers[0]}-L.jpg`
                        : null,
                    reviews: reviewsRes?.data?.reviews || [],
                    excerpts: excerptsRes?.data?.data || [],
                    deepDives: deepRes?.data?.data || [],
                });

                setRating(statsRes?.data?.averageRating || 0);
            } catch (e) {
                console.error("Book fetch error:", e.message);
                if (mounted) {
                    setError(e.response?.status === 503
                        ? "Server is temporarily unavailable. Please try again later."
                        : "Failed to load book data. Please check your connection.");
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchAll();
        return () => {
            mounted = false;
        };
    }, [bookKey, workId]);

    // ================================
    // POST RATING (protected)
    // ================================
    const handleSubmitRating = async () => {
        try {
            setSendingRating(true);

            await api.post("/reviews", {
                rating: userRating,
                content: "",
                book: {
                    bookKey, // ✅ FULL KEY
                    title: bookData.title,
                    author: bookData.authors.join(", "),
                    coverUrl: bookData.coverUrl,
                },
            });

            setUserRating(0);

            const statsRes = await api.get(
                `/reviews/book/${encodeURIComponent(bookKey)}/stats`
            );
            setRating(statsRes.data.averageRating || 0);
        } catch (e) {
            console.error("Rating error:", e.message);
        } finally {
            setSendingRating(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading…</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => router.back()} style={styles.goBack}>
                    <Ionicons name="chevron-back-outline" size={24} />
                </TouchableOpacity>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={() => { setError(null); setLoading(true); }} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (!bookData) {
        return (
            <View style={styles.container}>
                <Text>No data available</Text>
            </View>
        );
    }

    return (
        <ScrollView ref={scrollRef}>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => router.back()} style={styles.goBack}>
                    <Ionicons name="chevron-back-outline" size={24} />
                </TouchableOpacity>

                <View style={styles.livresque}>
                    <SimpleLineIcons name="book-open" size={30} color="white" />
                </View>

                {bookData.coverUrl && (
                    <Image source={{ uri: bookData.coverUrl }} style={styles.book_picture} />
                )}

                <Text style={styles.title}>{bookData.title}</Text>
                <Text style={styles.author}>
                    by {bookData.authors.join(", ")}
                </Text>

                <View style={styles.rate}>
                    <StarRating rating={rating} starSize={20} onChange={() => {}} />
                    <Text>{rating}</Text>
                </View>

                <View style={styles.sectionRatingUser}>
                    <Text style={styles.TitleRating}>Rate this book</Text>
                    <StarRating
                        rating={userRating}
                        onChange={setUserRating}
                        starSize={15}
                    />
                    <TouchableOpacity
                        onPress={handleSubmitRating}
                        disabled={userRating === 0 || sendingRating}
                        style={styles.validateButton}
                    >
                        <Text style={styles.validateButtonText}>Validate</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.description}>{bookData.description}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: "#FFFFFF" },
    goBack: { marginBottom: 16, width: 48, height: 48, borderRadius: 24, backgroundColor: "#F8F8F8", justifyContent: "center", alignItems: "center" },
    livresque: {
        alignSelf: "center",
        marginBottom: 20,
        backgroundColor: "#FF6B6B",
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#FF6B6B",
        shadowOpacity: 0.3,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
    },
    book_picture: {
        width: 220,
        height: 320,
        alignSelf: "center",
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 25,
        shadowOffset: { width: 0, height: 12 },
        elevation: 10,
    },
    title: { fontSize: 28, fontWeight: "800", textAlign: "center", color: "#000", letterSpacing: -0.5, paddingHorizontal: 20 },
    author: { textAlign: "center", fontSize: 16, marginBottom: 16, marginTop: 8, color: "#999", fontWeight: "600" },
    rate: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
    },
    sectionRatingUser: {
        marginBottom: 24,
        backgroundColor: "#F8F8F8",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
    },
    TitleRating: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "800",
        marginBottom: 12,
        color: "#000",
    },
    validateButton: {
        alignSelf: "center",
        backgroundColor: "#FF6B6B",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 25,
        marginTop: 12,
        paddingHorizontal: 32,
        height: 50,
        shadowColor: "#FF6B6B",
        shadowOpacity: 0.3,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
    },
    validateButtonText: {
        color: "white",
        fontWeight: "800",
        fontSize: 16,
        letterSpacing: 0.5,
    },
    description: {
        textAlign: "left",
        fontSize: 16,
        marginBottom: 24,
        lineHeight: 24,
        color: "#666",
        paddingHorizontal: 4,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        textAlign: "center",
        color: "#FF6B6B",
        fontSize: 16,
        marginBottom: 24,
        fontWeight: "600",
    },
    retryButton: {
        backgroundColor: "#FF6B6B",
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        shadowColor: "#FF6B6B",
        shadowOpacity: 0.3,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
    },
    retryButtonText: {
        color: "white",
        fontWeight: "800",
        fontSize: 16,
        letterSpacing: 0.5,
    },
});
