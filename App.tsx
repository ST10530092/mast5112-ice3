import { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// FIX 11: use the standard React Native picker, which works in Expo Go
import { Picker } from '@react-native-picker/picker';

// FIX 1: year and rating are numbers, because handleSave stores Number(...)
type Album = {
  id: string;
  title: string;
  artist: string;
  year: number;
  genre: string;
  rating: number;
};

const genres: string[] = [
  'Alternative',
  'Blues',
  'Classical',
  'Country',
  'Electronic',
  'Hip Hop',
  'Jazz',
  'Metal',
  'Pop',
  'R&B',
  'Reggae',
  'Rock',
  'Soundtrack',
  'Soul',
  'Other',
];

const MIN_TEXT_LENGTH = 2;
const MAX_TITLE_LENGTH = 50;
const MAX_ARTIST_LENGTH = 50;
const MIN_YEAR = 1900;
const MAX_RATING = 5;

export default function App() {
  const [title, setTitle] = useState<string>('');
  const [artist, setArtist] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [rating, setRating] = useState<string>('');

  const [albums, setAlbums] = useState<Album[]>([]);

  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter an album title.');
      return false;
    }

    // FIX 2: changed && to || so a title that is too short OR too long is rejected
    if (
      title.trim().length < MIN_TEXT_LENGTH ||
      title.trim().length > MAX_TITLE_LENGTH
    ) {
      Alert.alert(
        'Validation Error',
        `Album title must contain between ${MIN_TEXT_LENGTH} and ${MAX_TITLE_LENGTH} characters.`
      );
      return false;
    }

    if (!artist.trim()) {
      Alert.alert('Validation Error', 'Please enter an artist name.');
      return false;
    }

    // FIX 3: changed && to || for the artist length check
    if (
      artist.trim().length < MIN_TEXT_LENGTH ||
      artist.trim().length > MAX_ARTIST_LENGTH
    ) {
      Alert.alert(
        'Validation Error',
        `Artist name must contain between ${MIN_TEXT_LENGTH} and ${MAX_ARTIST_LENGTH} characters.`
      );
      return false;
    }

    if (!year.trim()) {
      Alert.alert('Validation Error', 'Please enter an album release year.');
      return false;
    }

    const numericYear = Number(year);

    if (!Number.isInteger(numericYear)) {
      Alert.alert('Validation Error', 'Album year must be a whole number.');
      return false;
    }

    const currentYear = new Date().getFullYear();

    // FIX 4: added the missing upper limit so future years are rejected
    if (numericYear < MIN_YEAR || numericYear > currentYear) {
      Alert.alert(
        'Validation Error',
        `Album year must be between ${MIN_YEAR} and ${currentYear}.`
      );
      return false;
    }

    if (!genre) {
      Alert.alert('Validation Error', 'Please select a genre.');
      return false;
    }

    if (!rating.trim()) {
      Alert.alert('Validation Error', 'Please enter a rating.');
      return false;
    }

    const numericRating = Number(rating);

    if (!Number.isInteger(numericRating)) {
      Alert.alert('Validation Error', 'Rating must be a whole number.');
      return false;
    }

    // FIX 5: added the missing upper limit so ratings above MAX_RATING are rejected
    if (numericRating < 1 || numericRating > MAX_RATING) {
      Alert.alert(
        'Validation Error',
        `Rating must be between 1 and ${MAX_RATING}.`
      );
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const temporaryAlbum: Album = {
      id: Date.now().toString(),
      title: title.trim(),
      artist: artist.trim(),
      year: Number(year),
      genre: genre,
      rating: Number(rating),
    };

    // FIX 6: keep the existing albums and append the new one
    setAlbums((currentAlbums) => [...currentAlbums, temporaryAlbum]);

    setTitle('');
    setArtist('');
    setYear('');
    setGenre('');
    setRating('');
  };

  const handleDelete = (id: string) => {
    // FIX 7: changed === to !== so every album except the selected one is kept
    setAlbums((currentAlbums) =>
      currentAlbums.filter((album) => album.id !== id)
    );
  };

  const renderAlbum = ({ item }: { item: Album }) => (
    <View style={styles.albumCard}>
      <View style={styles.albumInformation}>
        <Text style={styles.albumTitle}>{item.title}</Text>
        <Text style={styles.albumArtist}>{item.artist}</Text>
        <Text>Year: {item.year}</Text>
        <Text>Genre: {item.genre}</Text>
        <Text>Rating: {item.rating}/5</Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Album Collection</Text>

      <Text style={styles.label}>Album Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter album title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Artist</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter artist name"
        value={artist}
        onChangeText={setArtist}
      />

      <Text style={styles.label}>Year</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter release year"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Genre</Text>
      {/* FIX 8: selectedValue is bound to genre instead of title */}
      <Picker
        selectedValue={genre}
        onValueChange={(value: string) => setGenre(value)}
      >
        <Picker.Item label="Select a genre..." value="" />

        {/* FIX 9: each item now uses its own value instead of the genre state */}
        {genres.map((item) => (
          <Picker.Item key={item} label={item} value={item} />
        ))}
      </Picker>

      <Text style={styles.label}>Rating</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter rating from 1 to 5"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.addButton} onPress={handleSave}>
        <Text style={styles.addButtonText}>Add to Favourites</Text>
      </TouchableOpacity>

      <Text style={styles.collectionHeading}>
        My Favourite Albums ({albums.length})
      </Text>

      {/* FIX 10: keyExtractor uses the unique id instead of the title */}
      <FlatList
        data={albums}
        keyExtractor={(item) => item.id}
        renderItem={renderAlbum}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            No albums have been added yet.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2e7d32',
    borderRadius: 6,
    paddingVertical: 12,
    marginTop: 15,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  collectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  albumCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  albumInformation: {
    marginBottom: 10,
  },
  albumTitle: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  albumArtist: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 6,
  },
  deleteButton: {
    backgroundColor: '#c62828',
    borderRadius: 6,
    paddingVertical: 10,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#777777',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
