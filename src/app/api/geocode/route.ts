export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address)
    return Response.json(
      { error: "Address must be a string." },
      { status: 400 }
    );

  const response: Response = await fetch(
    `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?format=json&benchmark=Public_AR_Census2020&address=${encodeURIComponent(
      address
    )}`
  );

  const data = await response.json();

  return Response.json(data);
}
