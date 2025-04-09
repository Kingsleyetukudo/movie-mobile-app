import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import useFetch from '../services/useFetch'
import { fetchMovieDetails } from '../services/api'
import { icons } from '@/constants/icons'



interface MovieInforProps {
    label: string;
    value: string | number | null
}

const MovieInfo = ({ label, value }: MovieInforProps) => (
    <View className='flex-col items-start justify-center mt-5'>
        <Text className='text-light-200 text-sm font-normal'>{label}</Text>
        <Text className='text-light-100 text-sm font-bold mt-2'>{value || "N/A"}</Text>
    </View>
)


const Movivedetails
    = () => {
        const { id } = useLocalSearchParams()


        const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string));

        return (
            <View className='bg-primary flex-1'>
                <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                    <View>
                        <Image source={{
                            uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`
                        }} className='w-full h-[550px]' resizeMode='stretch' />
                    </View>

                    <View className='flex-col item-start justify-center mt-5 px-5'>
                        <Text className='text-white font-bold text-xl'>
                            {movie?.title}
                        </Text>

                        <View className='flex-row items-center justify-between  mt-2'>

                            <Text className='text-light-200 text-sm'>
                                {movie?.release_date?.split('-')[0]}
                            </Text>
                            <Text className='text-light-200 text-sm'>
                                {movie?.runtime}m
                            </Text>

                        </View>

                        <View className='flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2'>
                            <Image source={icons.star} className='w-4 h-4' resizeMode='contain' />

                            <Text className='font-bold text-white text-sm'>
                                {Math.round(movie?.vote_average ?? 0)} / 10
                            </Text>

                            <Text className='text-light-200 text-sm'>
                                ({movie?.vote_count} votes)
                            </Text>

                        </View>

                        <MovieInfo label='Overview' value={movie?.overview} />
                        <MovieInfo label='Genres' value={movie?.genres?.map((g) => g.name).join(' - ') || 'N/A'} />


                        <View className='flex flex-row justify-between w-1/2'>

                            <MovieInfo label='Budget' value={`$${movie?.budget / 1_000_000}million`} />
                            <MovieInfo label='Revenue' value={`$${Math.round(movie?.revenue) / 1_000_000}`} />

                        </View>
                        <MovieInfo label="Production Companies" value={movie?.production_companies?.map((p) => p.name).join(' - ') || 'N/A'} />
                    </View>
                </ScrollView>

                <TouchableOpacity className='absolute bottom-5 right-0 left-0 bg-accent mx-5 py-3.5 rounded-lg flex-row items-center justify-center gap-x-2 z-50' onPress={() => { router.back() }}>

                    <Image source={icons.arrow} className='size-5 mr-1 mt-0.5 rotate-180' tintColor="#fff" />

                    <Text className='text-white font-semibold text-base'>

                        Back to Movies
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

export default Movivedetails


const styles = StyleSheet.create({})