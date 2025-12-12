export const MOCK_BOOKS = [
    {
        id: '1',
        title: 'The Night Circus',
        author: 'Erin Morgenstern',
        cover: 'https://covers.openlibrary.org/b/id/7275431-L.jpg',
        tags: ['Fantasy', 'Romance'],
        suggestionReason: 'Car tu as aimé "Fourth Wing"',
    },
    {
        id: '2',
        title: 'The Silent Patient',
        author: 'Alex Michaelides',
        cover: 'https://covers.openlibrary.org/b/id/9259256-L.jpg',
        tags: ['Thriller', 'Psychologie'],
        suggestionReason: 'Parce que tu lis beaucoup de thrillers',
    },
    {
        id: '3',
        title: 'The Song of Achilles',
        author: 'Madeline Miller',
        cover: 'https://covers.openlibrary.org/b/id/12458282-L.jpg',
        tags: ['Mythologie', 'Romance'],
        suggestionReason: 'Similaire à "Circe"',
    },
    {
        id: '4',
        title: 'Atomic Habits',
        author: 'James Clear',
        cover: 'https://covers.openlibrary.org/b/id/9251765-L.jpg',
        tags: ['Développement personnel', 'Habitudes'],
        suggestionReason: 'Tu aimes les livres de productivité',
    },
    {
        id: '5',
        title: '1984',
        author: 'George Orwell',
        cover: 'https://covers.openlibrary.org/b/id/15354148-L.jpg',
        tags: ['Dystopie', 'Politique'],
        suggestionReason: 'Dans la même vibe que "Brave New World"',
    },
    {
        id: '6',
        title: 'Dune',
        author: 'Frank Herbert',
        cover: 'https://covers.openlibrary.org/b/id/10547366-L.jpg',
        tags: ['Sci-Fi', 'Épopée'],
        suggestionReason: 'Car tu recherches des classiques SF',
    },
    {
        id: '7',
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        cover: 'https://covers.openlibrary.org/b/id/8155416-L.jpg',
        tags: ['Philosophie', 'Aventure'],
        suggestionReason: 'Pour développer ta réflexion personnelle',
    },
    {
        id: '8',
        title: 'The Hobbit',
        author: 'J. R. R. Tolkien',
        cover: 'https://covers.openlibrary.org/b/id/6979861-L.jpg',
        tags: ['Fantasy', 'Aventure'],
        suggestionReason: 'Car tu aimes les univers épiques',
    },
    {
        id: '9',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        cover: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
        tags: ['Classique', 'Drame'],
        suggestionReason: 'Car tu apprécies les classiques modernes',
    },
    {
        id: '10',
        title: 'The Subtle Art of Not Giving a F*ck',
        author: 'Mark Manson',
        cover: 'https://covers.openlibrary.org/b/id/11153237-L.jpg',
        tags: ['Développement personnel', 'Humour'],
        suggestionReason: 'Dans la continuité de "Atomic Habits"',
    },
];

// Expo Router scans all files under `app/` as routes and expects a default export.
// This no-op component prevents route warnings while allowing this file to be a plain module.
export default function BookConstantsRoutePlaceholder() {
  return null;
}