"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";

interface WeatherData {
  detailedForecast: string;
  shortForecast: string;
  temperature: number;
  temperatureUnit: string;
  icon: string;
  startTime: string;
}

const Home: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const geoResponse = await fetch(
        `/api/geocode?address=${encodeURIComponent(address)}`
      );
      if (!geoResponse.ok) {
        throw new Error("Geocoding failed");
      }
      const coordinates = await geoResponse.json();

      const weatherResponse = await fetch(
        `https://api.weather.gov/points/${parseFloat(coordinates.y).toFixed(
          4
        )},${parseFloat(coordinates.x).toFixed(4)}`
      );
      if (!weatherResponse.ok) {
        throw new Error("Weather fetching failed");
      }
      const weatherPointsData = await weatherResponse.json();

      const response = await fetch(
        `https://api.weather.gov/gridpoints/MTR/${weatherPointsData.properties.gridX},${weatherPointsData.properties.gridY}/forecast`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const weatherData = await response.json();
      setWeather(weatherData.properties.periods[0]);
    } catch (error: any) {
      setError(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4">
          Weather Forecast Inquiry
        </h1>
        <p className="text-gray-600 text-center mb-4">
          Enter an address (e.g., &quot;1600 Pennsylvania Ave NW, Washington,
          DC&quot;) to get the detailed weather forecast.
        </p>
        <form
          onSubmit={handleFormSubmit}
          className="bg-white shadow-md rounded-lg p-8 mb-4"
        >
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={address}
              onChange={handleAddressChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter an address"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            Get Forecast
          </button>
        </form>
        {loading && (
          <div className="text-center">
            <p>Loading...</p>
          </div>
        )}
        {error && (
          <div className="text-center text-red-500">
            <p>Error: {error}</p>
          </div>
        )}
        {weather && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Detailed Forecast:</h2>
            <img
              src={weather.icon}
              alt="Weather icon"
              className="mx-auto w-20 h-20"
            />
            <p className="text-sm">
              Temperature: {weather.temperature}°{weather.temperatureUnit} /{" "}
              {Math.round(((weather.temperature - 32) * 5) / 9)}°C
            </p>
            <p className="text-sm">{weather.shortForecast}</p>
            <p className="text-sm">{weather.detailedForecast}</p>
            <p className="text-sm">
              Start Time: {new Date(weather.startTime).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
