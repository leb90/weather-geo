import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

const cors = Cors({
    methods: ['GET', 'HEAD'],
});

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

const getWeatherData = async (lat: number, lon: number) => {
    const headers = {
        'User-Agent': 'https://weather-geo-c.netlify.app (leam.90@gmail.com)',
        'Accept': 'application/vnd.noaa.dwml+json;version=1',
        'Content-Type': 'application/cap+xml'
    };

    try {
        const pointResponse = await fetch(`https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`, { headers });
        if (!pointResponse.ok) throw new Error('Failed to fetch point data');
        const pointData = await pointResponse.json();
        const gridX = pointData.properties.gridX;
        const gridY = pointData.properties.gridY;

        const forecastResponse = await fetch(`https://api.weather.gov/gridpoints/MTR/${gridX},${gridY}/forecast`, { headers });
        if (!forecastResponse.ok) throw new Error('Failed to fetch forecast data');
        return await forecastResponse.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Run the middleware
    await runMiddleware(req, res, cors);

    const { lat, lon } = req.query;
    const latitude = Array.isArray(lat) ? parseFloat(lat[0]) : parseFloat(lat as string);
    const longitude = Array.isArray(lon) ? parseFloat(lon[0]) : parseFloat(lon as string);

    if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({ error: 'Invalid latitude or longitude' });
        return;
    }

    try {
        const weatherData = await getWeatherData(latitude, longitude);
        res.status(200).json(weatherData);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
