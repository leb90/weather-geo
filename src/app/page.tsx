"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";

interface WeatherPeriod {
  detailedForecast: string;
  shortForecast: string;
  temperature: number;
  temperatureUnit: string;
  icon: string;
  startTime: string;
}

interface WeatherData {
  periods: WeatherPeriod[];
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
      const geoResponse = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
      if (!geoResponse.ok) {
        throw new Error("Geocoding failed");
      }
      const coordinates = await geoResponse.json();

      const weatherResponse = await fetch(`/api/weather?lat=${coordinates.y}&lon=${coordinates.x}`);
      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const weatherData = await weatherResponse.json();
  
      setWeather(weatherData.properties);
    } catch (error: any) {
      setError(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4">Weather Forecast Inquiry</h1>
        <p className="text-gray-600 text-center mb-4">
          Enter an address (e.g., &quot;1600 Pennsylvania Ave NW, Washington,
          DC&quot;) to get the detailed weather forecast.
        </p>
        <form onSubmit={handleFormSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
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
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
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
            <h2 className="text-lg font-bold">7-Day Detailed Forecast:</h2>
            {weather.periods.map((period, index) => (
              <div key={index} className="mt-4 p-2 border-b last:border-b-0">
                <h3 className="font-bold">{new Date(period.startTime).toLocaleDateString()}</h3>
                <img src={period.icon} alt="Weather icon" className="mx-auto w-20 h-20" />
                <p className="text-sm">
                  Temperature: {period.temperature}°{period.temperatureUnit} /{" "}
                  {Math.round(((period.temperature - 32) * 5) / 9)}°C
                </p>
                <p className="text-sm">{period.shortForecast}</p>
                <p className="text-sm">{period.detailedForecast}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
