import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Link } from 'expo-router'
import { images } from '@/constants/images'
import MaskedView from '@react-native-masked-view/masked-view'

const TrendingCard = ({ movie: { movie_id, title, poster_url }, index }: TrendingCardProps) => {
    return (

        <Link href={`/movies/${movie_id}`} asChild>
            <TouchableOpacity className="w-32  pl-5 relative ">
                <Image source={{ uri: poster_url }} className="w-full h-48 rounded-lg" resizeMode="cover" />

                <View className='absolute bottom-9 left-3.5 h-12 rounded-full px-0 py-1'>
                    <MaskedView maskElement={
                        <View>
                            <Text className='font-bold text-white text-6xl'>
                                {index + 1}
                            </Text>
                        </View>
                    }> <Image source={images.rankingGradient} className='size-14' resizeMode='cover' /></MaskedView>
                </View>
                <Text className='text-sm font-bold mt-2 text-light-200' numberOfLines={2}>
                    {title}
                </Text>
            </TouchableOpacity>
        </Link>
    )
}

export default TrendingCard

const styles = StyleSheet.create({})