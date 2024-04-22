const BASE_URL = "https://api.weather.gov";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latParam = searchParams.get("lat");
  const lonParam = searchParams.get("lon");

  if (!latParam || !lonParam) {
    return Response.json(
      { error: "Missing lat and lon query parameters" },
      { status: 400 }
    );
  }

  const lat = Number(latParam).toFixed(4);
  const lon = Number(lonParam).toFixed(4);

  const points = await fetch(`${BASE_URL}/points/${lat},${lon}`);
  const pointsData = await points.json();
  
  const weatherResponse = await fetch(
    `${BASE_URL}/gridpoints/${pointsData.properties.cwa}/${pointsData.properties.gridX},${pointsData.properties.gridY}/forecast`
  );
  const weatherData = await weatherResponse.json();

  return Response.json(weatherData);
}
