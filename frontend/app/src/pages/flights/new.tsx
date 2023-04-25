import { useState } from 'react';
import dynamic from 'next/dynamic';
import { PathLayer } from '@deck.gl/layers/typed';
import Mapbox from 'components/Mapbox';
import { DOMParser } from 'xmldom';
import { gpx } from 'togeojson';
import { Box } from '@mui/system';

const DeckGL = dynamic(() => import('@deck.gl/react/typed'), { ssr: false });

interface GPXType {
  type: string;
  features: any[];
}

const GpxPage = () => {
  const [gpxData, setGpxData] = useState<GPXType | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("file");
    console.log(file);
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const gpxText = event.target?.result;
      console.log("gpxText");
      console.log(gpxText);
      if (typeof gpxText === 'string') {
        const parser = new DOMParser();
        const gpxXML = parser.parseFromString(gpxText, 'application/xml');
        const geoJSONData = gpx(gpxXML);
        setGpxData(geoJSONData);
      }
    };
    reader.readAsText(file);
  };

  const layers = gpxData
    ? [
        new PathLayer({
          id: 'path-layer',
          data: gpxData.features,
          getPath: (d: any) => d.geometry.coordinates,
          getColor: [255, 0, 0],
          getWidth: 10,
        }),
      ]
    : [];

  console.log("layers");
  console.log(layers);

  return (
    <div>
      <Box mb={4}>
        <input type="file" accept=".gpx" onChange={handleFileUpload} />
      </Box>
      <div style={{ flexGrow: 1, position: "relative", height: "600px", marginBottom: "32px" }}>
        <Mapbox layers={layers} />
      </div>
    </div>
  );
};

export default GpxPage;
