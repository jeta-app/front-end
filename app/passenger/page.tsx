"use client";
import React, { RefObject, useRef, useState } from "react";
import BottomSheet from "./components/bottom-sheet";
import MapDirection from "./components/map-passenger";
import { useRouter } from "next/navigation";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import Image from "next/image";
import MapLoader from "../map-loader/map_loader";

const MapPassenger = () => {
  const router = useRouter();
  const [direction, setDirection] = useState("");
  const [isInputActive, setIsInputActive] = useState(false);
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [isCanFocusMap, setIsCanFocusMap] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState<boolean>(false);
  const [destinationRecomendation, setDestinationRecomendation] = useState<DestinationType | null>(null);
  const [isFilteredEmpty, setIsFilteredEmpty] = useState(false);
  const handleClickOnFocusMap = () => {
    setIsCanFocusMap(!isCanFocusMap);
  };
  const handleInputFocus = () => {
    setIsInputActive(true);
  };

  const handleBackClick = () => {
    router.push("/allow-location");
  };

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    setDirection(inputRef.current?.value || "");
    if (autocompleteRef.current) {
      setIsFilteredEmpty(false);
      const place = autocompleteRef.current.getPlace();

      if (place.geometry && place.geometry.location) {
        const newCenter = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
        setSearchCenter(newCenter);
        console.log("newCenter", newCenter);
      }
    }
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      setDirection("");
    }
    setIsFilteredEmpty(true);
  };

  const handleDestinationRecomendation = (data: DestinationType) => {
    console.log("data recomendation", data);

    setDestinationRecomendation(data);
    setShowRecommendation(true);
  };

  return (
    <div className="x relative flex-col flex min-h-screen w-full items-center">
      <MapLoader containerStyle={{ width: "100%", height: "100vh" }} center={{ lat: -6.618650409604555, lng: 110.68881761754635 }} zoom={10}>
        <div className="z-50 absolute mt-3 px-5 w-full">
          <div className="flex items-center px-5 bg-white w-full h-14 rounded-3xl shadow-lg border border-gray-200">
            <button onClick={() => handleBackClick()} className="w-[5%]">
              <Image className="w-2" src="icons/back.svg" width={500} height={500} alt="Logo" />
            </button>
            <div className="w-[80%]">
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <input type="text" ref={inputRef} onFocus={handleInputFocus} className="w-full input focus:border-none focus:outline-none" placeholder="Cari Lokasi" />
              </Autocomplete>
            </div>
            <div className="w-[10%] text-xl flex justify-end">
              <button onClick={handleClear} className="clear text-white text-center rounded-full bg-gray-400 w-7">
                x
              </button>
            </div>
          </div>
        </div>

        <div className="focus z-10 absolute bottom-[5%] right-3 transform -translate-y-1/2 flex flex-col">
          <div className="w-11 h-11 mt-5 shadow items-center text-3xl rounded-sm flex justify-center bg-white">
            <button onClick={() => handleClickOnFocusMap()} className=" ">
              {isCanFocusMap ? <Image src="icons/focus.svg" className="w-7" width={500} height={500} alt="Focus" /> : <Image src="icons/unfocus.svg" className="w-7" width={500} height={500} alt="Focus" />}
            </button>
          </div>
        </div>
        <MapDirection searchCenter={searchCenter} handleDestinationRecomendation={handleDestinationRecomendation} isFilteredEmpty={isFilteredEmpty} isCanFocusMap={isCanFocusMap} />
        <div className="z-10 absolute bottom-0 left-0 w-full">
          <BottomSheet
            isInputActive={isInputActive}
            onSetIsInputActive={setIsInputActive}
            direction={direction}
            destinationRecomendation={destinationRecomendation}
            showRecommendation={showRecommendation}
            setShowRecommendation={setShowRecommendation}
          />
        </div>
      </MapLoader>
    </div>
  );
};

export default MapPassenger;
