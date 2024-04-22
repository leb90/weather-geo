export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    if (!address) {
        return Response.redirect('/', 303);
    }
    const response = await fetch(
      `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?format=json&benchmark=Public_AR_Census2020&address=${encodeURIComponent(
        address
      )}`
    );
    const resp = await response.json();
    const { x, y } = resp.result.addressMatches[0].coordinates;

    return Response.json({x, y});

  }