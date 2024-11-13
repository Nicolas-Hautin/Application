import useFetch from "../useFetch";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Button } from "./components/ui/button";
import { motion } from "framer-motion";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [filteredEpisodes, setFilteredEpisodes] = useState([]);
  const carouselRef = useRef(null);

  const showsUrl = "https://api.tvmaze.com/shows";
  const { data: showsData, loading: showsLoading, error: showsError } = useFetch(showsUrl);

  const showDetailsUrl = selectedShow
    ? `https://api.tvmaze.com/shows/${selectedShow.id}?embed[]=cast&embed[]=episodes`
    : null;
  const {
    data: showDetailsData,
    loading: showDetailsLoading,
    error: showDetailsError,
  } = useFetch(showDetailsUrl);

  useEffect(() => {
    if (showDetailsData) {
      setSelectedShow(showDetailsData);
      setFilteredEpisodes(
        showDetailsData._embedded.episodes.filter(
          (episode) => episode.season === selectedSeason
        )
      );
    }
  }, [showDetailsData, selectedSeason]);

  const filteredShows = showsData
    ? showsData.filter((show) =>
        show.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const seasons = selectedShow?._embedded?.episodes
    ? Array.from(
        new Set(
          selectedShow._embedded.episodes.map((episode) => episode.season)
        )
      ).map((seasonNumber) => ({
        number: seasonNumber,
      }))
    : [];

  const openModal = (show) => {
    setSelectedShow(show);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedShow(null);
  };

  return (
    <div className="bg-black flex flex-col">
      <div className="flex justify-between items-center m-5">
        <div className="flex justify-center items-center">
          <img src="/logo.png" alt="Logo" />
        </div>
        <div className="relative w-64 flex items-center gap-4 ml-4 sm:ml-0">
          <input
            type="text"
            placeholder="Search for a show..."
            className="border w-full p-2 rounded bg-black text-white border-white pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button className="hidden md:block bg-black border border-white p-2">Sign up</Button>
          <Button className="hidden md:block bg-green-600 p-2">Login</Button>
        </div>
      </div>

      {showsLoading ? (
        <p>Loading shows...</p>
      ) : showsError ? (
        <p>Error fetching shows</p>
      ) : (
        !isModalOpen && filteredShows && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-4 m-5">
            {filteredShows.map((show) => (
              <div
                key={show.id}
                onClick={() => openModal(show)}
                className="relative cursor-pointer text-white rounded"
              >
                <img
                  src={show.image?.medium}
                  alt={show.name}
                  className="w-full rounded-lg"
                />
                <div className="absolute flex justify-between bottom-0 w-full bg-gradient-to-t from-black p-4">
                  <h3 className="text-md text-white">{show.name}</h3>
                  <div className="flex gap-2 justify-center items-center">
                    <img src="/star.svg" alt="star" className="w-6" />
                    <h3 className="text-md text-white">{show?.rating.average}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {isModalOpen && selectedShow && !showDetailsLoading && !showDetailsError && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}>
          <div>
            <Card className="bg-black text-white rounded overflow-hidden border-none">
              <button
                onClick={closeModal}
                className="absolute text-white right-5 top-4 z-40"
              >
                <img src="/Vector.png" alt="Close" className="w-6" />
              </button>
              <CardContent className="m-0 p-0 relative">
                <img
                  src={selectedShow.image?.original}
                  alt={selectedShow.name}
                  className="w-full md:max-h-96"
                />
                <CardHeader className="w-full absolute bottom-0 bg-gradient-to-t from-black">
                  <CardTitle className="text-xl">{selectedShow.name}</CardTitle>
                  <p>{selectedShow.genres.join(", ")}</p>
                  <p>{selectedShow.runtime} minutes</p>
                </CardHeader>
              </CardContent>

              <CardContent className="flex flex-col gap-4 md:gap-10">
                <div className="flex justify-between items-center gap-2">
                  <Button className="w-64">Continue Watching</Button>
                  <div className="flex gap-3">
                    <Button className="bg-black bg-opacity-0 border w-12">
                      <img src="/Icon-Save.svg" alt="Save" />
                    </Button>
                    <Button className="bg-black bg-opacity-0 border w-12">
                      <img src="/Icon-Like.svg" alt="Like"/>
                    </Button>
                    <Button className="bg-black bg-opacity-0 border w-12">
                      <img src="/Icon-DL.svg" alt="Download" />
                    </Button>
                  </div>
                </div>

                <p>
                  <span
                    dangerouslySetInnerHTML={{ __html: selectedShow.summary }}
                  />
                </p>

                <Carousel>
                  <CarouselContent>
                    {selectedShow._embedded?.cast.map((member, index) => (
                      <CarouselItem
                        key={index}
                        className="flex-none w-full md:w-1/4 xl:w-1/5 flex items-center justify-center"
                      >
                        <div className="flex items-center">
                          <img
                            src={member.person.image?.medium}
                            alt={member.person.name}
                            className="w-16 rounded-lg mr-4"
                          />
                          <div>
                            <p className="font-semibold">{member.person.name}</p>
                            <p className="text-gray-600">{member.character.name}</p>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="-left-2 opacity-100 disabled:opacity-0 text-black" />
                  <CarouselNext className="-right-2 opacity-100 disabled:opacity-0 text-black" />
                </Carousel>

                <div id="Carrousel_Episode" className="text-white">
                  <div className="p-4 flex justify-between">
                    <h3 className="text-2xl font-bold">{`Episodes 1 - ${filteredEpisodes.length}`}</h3>
                    <Select
                      onValueChange={(value) => setSelectedSeason(Number(value))}
                    >
                      <SelectTrigger id="season-select" className="bg-black text-white p-2 rounded w-32">
                        <SelectValue placeholder="Season 1" />
                      </SelectTrigger>
                      <SelectContent>
                        {seasons.map((season) => (
                          <SelectItem
                            key={season.number}
                            value={season.number.toString()}
                          >
                            Season {season.number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Carousel>
                    <CarouselContent ref={carouselRef} className="px-4 flex">
                      {filteredEpisodes.map((episode, index) => (
                        <CarouselItem
                          key={index}
                          className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 flex flex-col items-center justify-center relative"
                        >
                          <img
                            src={episode.image?.original}
                            alt={episode.name}
                            className="h-auto object-cover rounded"
                          />
                          <div className="absolute bottom-0 left-4 bg-gradient-to-t from-black p-4 rounded">
                            <p className="font-bold">Episode {episode.number}</p>
                            <p className="text-gray-300">
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: episode?.summary
                                    ? (() => {
                                        const words = episode.summary.split(" ");
                                        return words.length > 12
                                          ? words.slice(0, 12).join(" ") + "..."
                                          : episode.summary;
                                      })()
                                    : "",
                                }}
                              />
                            </p>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-2 opacity-100 disabled:opacity-0 text-black" />
                    <CarouselNext className="-right-2 opacity-100 disabled:opacity-0 text-black" />
                  </Carousel>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}