export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat")?.slice(0, 10);
  const lon = searchParams.get("lon")?.slice(0, 10);

  if (!lat || !lon) {
    return Response.redirect("/", 303);
  }
  const headers = {
    "User-Agent": "(myweatherapp.com, contact@myweatherapp.com)",
    "Content-Type": "application/geo+json",
  };
  const pointResponse = await fetch(
    `https://api.weather.gov/points/${lat},${lon}`,
    { headers }
  );

  if (!pointResponse.ok) {
    return new Response("Failed to fetch point data", { status: 500 });
  }
  const pointData = await pointResponse.json();
  const gridX = pointData.properties.gridX;
  const gridY = pointData.properties.gridY;

  const forecastResponse = await fetch(
    `https://api.weather.gov/gridpoints/MTR/${gridX},${gridY}/forecast`,
    { headers }
  );
  if (!forecastResponse.ok) {
    return new Response("Failed to fetch forecast data", { status: 500 });
  }
  const forecastData = await forecastResponse.json();

  return new Response(JSON.stringify(forecastData), {
    headers: { "Content-Type": "application/json" },
  });
}
