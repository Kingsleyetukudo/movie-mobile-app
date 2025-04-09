import { Client, Databases, ID, Query } from "react-native-appwrite";

// const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
// const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || "";
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID || "";
const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "";
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "";
const FAVORITES_ID = process.env.EXPO_PUBLIC_APPWRITE_FAVORITES_ID || "";

if (
  !DATABASE_ID ||
  !COLLECTION_ID ||
  !ENDPOINT ||
  !PROJECT_ID ||
  !FAVORITES_ID
) {
  console.error("Missing Appwrite environment variables");
}

// const client = new Client()
//   .setEndpoint("https://cloud.appwrite.io/v1")
//   .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const database = new Databases(client);
export const updateSearchCount = async (searchQuery: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchQuery),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];

      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
          //   movies: [...existingMovie.movies, movie],
        }
      );
    } else {
      database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: searchQuery,
        count: 1,
        movie_id: movie.id,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const handleSaveFavorite = async (movie: Movie) => {
  if (movie) {
    try {
      await database.createDocument(DATABASE_ID, FAVORITES_ID, ID.unique(), {
        movie_id: movie.id,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        vote_count: movie.vote_count,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
      });
      alert("Movie saved to favorites!");
    } catch (error) {
      console.error("Error saving favorite:", error);
      alert("Failed to save movie.");
    }
  }
};

// Function to fetch all favorite movies
export const fetchFavorites = async (): Promise<Movie[]> => {
  try {
    const response = await database.listDocuments(DATABASE_ID, FAVORITES_ID);
    return response.documents as Movie[];
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};

// Function to remove a movie from the favorites collection
export const handleRemoveFavorite = async (id: string) => {
  try {
    await database.deleteDocument(DATABASE_ID, FAVORITES_ID, id);
    alert("Movie removed from favorites!");
  } catch (error) {
    console.error("Error removing favorite:", error);
    alert("Failed to remove movie.");
  }
};
