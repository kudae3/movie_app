import MovieCard from '@/components/MovieCard'
import SearchBar from '@/components/SearchBar'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { useFetch } from '@/hooks/useFetch'
import { fetchMovies } from '@/services/api'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native'

const Search = () => {

  const [searchQuery, setSearchQuery] = useState('')
  
  const {data, loading, error, fetchData, reset} = useFetch(() => fetchMovies({
    query: searchQuery
  }), false);

  const movies = data?.results || [];


  const handleSearch = (text: string) => {
    setSearchQuery(text);
  }

  useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        if(searchQuery.trim()){
          fetchData();
        } else {
          reset();
        }
        
      }, 500);

      return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]); 
  
  return (
    <View
      className="flex-1 bg-primary"
    >
      <Image source={images.bg} className="absolute w-full z-0" resizeMode="cover" />

      <FlatList 
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          paddingRight: 5,
          marginBottom: 10,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="px-5"
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search for a movie"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}

            {!loading &&
              !error &&
              searchQuery.trim() &&
              movies?.length! > 0 && (
                <Text className="text-xl text-white font-bold pb-5">
                  Search Results for{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim()
                  ? "No movies found"
                  : "Start typing to search for movies"}
              </Text>
            </View>
          ) : null
        }
      />

    </View>
  )
}

export default Search
