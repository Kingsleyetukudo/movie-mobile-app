import { Image, StyleSheet, Text, View, FlatList, Button, Touchable, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { fetchFavorites, handleRemoveFavorite } from '../services/appwrite';
import { icons } from '@/constants/icons';

const Saved = () => {
    const [favorites, setFavorites] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            const loadFavorites = async () => {
                setLoading(true);
                const data = await fetchFavorites();
                setFavorites(data);
                setLoading(false);
            };

            loadFavorites();
        }, [])
    );

    if (loading) {
        return (
            <View className='bg-primary flex-1 justify-center items-center'>
                <Text className='text-white'>Loading...</Text>
            </View>
        );
    }

    return (
        <View className='bg-primary flex-1 px-10 pt-16'>
            {favorites.length === 0 ? (
                <View className='flex justify-center items-center flex-1 flex-col gap-5'>
                    <Text className='text-gray-500 text-base'>No saved movies yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.$id}
                    renderItem={({ item }) => (
                        <View className='flex-row items-center gap-4 my-2'>
                            <Image
                                source={{ uri: `https://image.tmdb.org/t/p/w500${item?.poster_url}` }}
                                className='w-16 h-24 rounded-lg'
                                resizeMode='cover'
                            />
                            <View className='flex-col'>



                                <Text className='text-white text-base  ' numberOfLines={2}>
                                    {item.title}
                                </Text>

                                <View className='flex-row items-center justify-center gap-x-1'>


                                    <Image source={icons.star} className='w-4 h-4' resizeMode='contain' />

                                    <Text className='font-bold text-white text-sm'>
                                        {Math.round(item?.vote_average ?? 0)} / 10
                                    </Text>

                                    <Text className='text-light-200 text-sm'>
                                        ({item?.vote_count} votes)
                                    </Text>
                                </View>
                                <Text className='text-light-200 text-sm'>{item?.release_date ? `Release Year: ${item?.release_date.split('-')[0]}` : ''}</Text>

                            </View>
                            <TouchableOpacity className='bg-dark-100 px-4 py-2 rounded-full ml-auto'

                                onPress={() => {
                                    handleRemoveFavorite(item.$id);
                                    setFavorites((prev) => prev.filter((movie) => movie.$id !== item.$id));
                                }}
                            >
                                <Text className='text-light-200'>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default Saved;

const styles = StyleSheet.create({});