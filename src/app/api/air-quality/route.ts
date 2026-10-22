import { NextResponse } from 'next/server';

interface AirQualityIndex {
  code: string;
  displayName: string;
  aqi: number;
  aqiDisplay: string;
  category: string;
  dominantPollutant: string;
  color: { red: number; green: number; blue: number };
}

interface AirPollutant {
  code: string;
  displayName: string;
  fullName: string;
  value: number;
  units: string;
}

interface GoogleAirQualityIndex {
  code?: string;
  displayName?: string;
  aqi?: number;
  aqiDisplay?: string;
  category?: string;
  dominantPollutant?: string;
  color?: { red?: number; green?: number; blue?: number };
}

interface GoogleAirQualityPollutant {
  code?: string;
  displayName?: string;
  fullName?: string;
  concentration?: { value?: number; units?: string };
}

interface GoogleAirQualityPayload {
  dateTime?: string;
  indexes?: GoogleAirQualityIndex[];
  pollutants?: GoogleAirQualityPollutant[];
  healthRecommendations?: Record<string, string> | null;
  error?: { message?: string };
}

interface OpenMeteoCurrent {
  time?: string;
  european_aqi?: number;
  us_aqi?: number;
  pm10?: number;
  pm2_5?: number;
  carbon_monoxide?: number;
  nitrogen_dioxide?: number;
  sulphur_dioxide?: number;
  ozone?: number;
}

interface OpenMeteoPayload {
  current?: OpenMeteoCurrent;
  current_units?: Record<string, string>;
  error?: boolean;
  reason?: string;
}

interface NormalizedAirQuality {
  source: 'google' | 'open-meteo';
  index: AirQualityIndex;
  pollutants: AirPollutant[];
  dateTime: string | null;
  healthRecommendations: Record<string, string> | null;
}

const GOOGLE_AIR_QUALITY_KEY = process.env.GOOGLE_AIR_QUALITY_API_KEY || '';

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

async function fetchGoogleAirQuality(
  lat: number,
  lng: number
): Promise<NormalizedAirQuality> {
  const response = await fetch(
    `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${encodeURIComponent(
      GOOGLE_AIR_QUALITY_KEY
    )}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: { latitude: lat, longitude: lng },
        extraComputations: [
          'POLLUTANT_CONCENTRATION',
          'DOMINANT_POLLUTANT_CONCENTRATION',
          'HEALTH_RECOMMENDATIONS',
        ],
        languageCode: 'en',
      }),
      cache: 'no-store',
    }
  );

  const payload = (await response.json()) as GoogleAirQualityPayload;

  if (!response.ok) {
    throw new Error(payload.error?.message || 'Google Air Quality lookup failed.');
  }

  const rawIndex = payload.indexes?.[0];
  if (!rawIndex || typeof rawIndex.aqi !== 'number') {
    throw new Error('No air quality index was returned for this location.');
  }

  const pollutants = (payload.pollutants ?? [])
    .filter(
      (pollutant): pollutant is GoogleAirQualityPollutant & {
        concentration: { value: number; units?: string };
      } => typeof pollutant.concentration?.value === 'number'
    )
    .map((pollutant) => ({
      code: pollutant.code || 'unknown',
      displayName: pollutant.displayName || pollutant.code || 'Unknown',
      fullName: pollutant.fullName || pollutant.displayName || 'Unknown',
      value: pollutant.concentration.value,
      units: pollutant.concentration.units || '',
    }));

  return {
    source: 'google',
    index: {
      code: rawIndex.code || 'uaqi',
      displayName: rawIndex.displayName || 'Air Quality Index',
      aqi: rawIndex.aqi,
      aqiDisplay: rawIndex.aqiDisplay || String(rawIndex.aqi),
      category: rawIndex.category || 'Unknown',
      dominantPollutant: rawIndex.dominantPollutant || 'unknown',
      color: {
        red: rawIndex.color?.red ?? 212,
        green: rawIndex.color?.green ?? 175,
        blue: rawIndex.color?.blue ?? 55,
      },
    },
    pollutants,
    dateTime: payload.dateTime ?? null,
    healthRecommendations: payload.healthRecommendations ?? null,
  };
}

function openMeteoCategory(aqi: number): { category: string; color: AirQualityIndex['color'] } {
  if (aqi <= 20) return { category: 'Good', color: { red: 76, green: 175, blue: 80 } };
  if (aqi <= 40) return { category: 'Fair', color: { red: 139, green: 195, blue: 74 } };
  if (aqi <= 60) return { category: 'Moderate', color: { red: 255, green: 193, blue: 7 } };
  if (aqi <= 80) return { category: 'Poor', color: { red: 255, green: 152, blue: 0 } };
  if (aqi <= 100) return { category: 'Very poor', color: { red: 244, green: 67, blue: 54 } };
  return { category: 'Extremely poor', color: { red: 156, green: 39, blue: 176 } };
}

async function fetchOpenMeteoAirQuality(
  lat: number,
  lng: number
): Promise<NormalizedAirQuality> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    current:
      'european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone',
    timezone: 'auto',
  });

  const response = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?${params.toString()}`,
    { cache: 'no-store' }
  );

  const payload = (await response.json()) as OpenMeteoPayload;
  if (!response.ok || payload.error || !payload.current) {
    throw new Error(payload.reason || 'Open-Meteo air quality lookup failed.');
  }

  const current = payload.current;
  const aqi = current.european_aqi ?? current.us_aqi;
  if (typeof aqi !== 'number') {
    throw new Error('No air quality index was returned for this location.');
  }

  const { category, color } = openMeteoCategory(aqi);
  const units = payload.current_units || {};
  const pollutantConfig: Array<{
    key: keyof OpenMeteoCurrent;
    code: string;
    displayName: string;
    fullName: string;
  }> = [
    { key: 'pm2_5', code: 'pm25', displayName: 'PM2.5', fullName: 'Fine particulate matter (PM2.5)' },
    { key: 'pm10', code: 'pm10', displayName: 'PM10', fullName: 'Coarse particulate matter (PM10)' },
    { key: 'nitrogen_dioxide', code: 'no2', displayName: 'NO₂', fullName: 'Nitrogen dioxide' },
    { key: 'sulphur_dioxide', code: 'so2', displayName: 'SO₂', fullName: 'Sulphur dioxide' },
    { key: 'ozone', code: 'o3', displayName: 'O₃', fullName: 'Ozone' },
    { key: 'carbon_monoxide', code: 'co', displayName: 'CO', fullName: 'Carbon monoxide' },
  ];

  const pollutants = pollutantConfig.flatMap(({ key, code, displayName, fullName }) => {
    const value = current[key];
    if (typeof value !== 'number') return [];
    return [
      {
        code,
        displayName,
        fullName,
        value,
        units: units[key] || 'µg/m³',
      },
    ];
  });

  return {
    source: 'open-meteo',
    index: {
      code: 'european_aqi',
      displayName: 'European AQI',
      aqi,
      aqiDisplay: String(aqi),
      category,
      dominantPollutant: 'pm25',
      color: {
        red: clampByte(color.red),
        green: clampByte(color.green),
        blue: clampByte(color.blue),
      },
    },
    pollutants,
    dateTime: current.time ?? null,
    healthRecommendations: null,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get('lat'));
  const lng = Number(searchParams.get('lng'));

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    Math.abs(lat) > 90 ||
    Math.abs(lng) > 180
  ) {
    return NextResponse.json(
      { success: false, available: false, error: 'Valid lat and lng are required.' },
      { status: 400 }
    );
  }

  const errors: string[] = [];

  if (GOOGLE_AIR_QUALITY_KEY) {
    try {
      const result = await fetchGoogleAirQuality(lat, lng);
      return NextResponse.json(
        { success: true, available: true, ...result },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=300',
          },
        }
      );
    } catch (error: unknown) {
      errors.push(error instanceof Error ? error.message : 'Google Air Quality lookup failed.');
    }
  }

  try {
    const result = await fetchOpenMeteoAirQuality(lat, lng);
    return NextResponse.json(
      { success: true, available: true, ...result },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: unknown) {
    errors.push(error instanceof Error ? error.message : 'Open-Meteo lookup failed.');
  }

  return NextResponse.json(
    { success: false, available: false, error: errors.join(' ') || 'Air quality lookup failed.' },
    { status: 502 }
  );
}
