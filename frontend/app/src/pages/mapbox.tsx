import { NextPage } from "next";
import ReactMap from 'react-map-gl';
import {useState} from "react";
import DeckGL from '@deck.gl/react/typed';
import {GeoJsonLayer} from '@deck.gl/layers/typed';

const Page: NextPage = () => {

    const data = require('datas/data.json')
    const [viewport, setViewport] = useState({
        width: 400,
        height: 400,
        latitude: 35.681236,
        longitude: 139.767125,
        zoom: 10
    });

    const layer = new GeoJsonLayer({
        data,
        filled: true,
        stroked: true,
        getLineWidth: 10,
        getLineColor: [255, 0, 0],
        getFillColor: () => {
            const rand = Math.floor(Math.random() * Math.floor(10))
            if (rand <= 5) {
                return [0, 0, 255]
            }
            return [255, 255, 255, 50]
        }
    })

    return (
        <DeckGL
            width={"100vw"}
            height={"100vh"}
            controller
            layers={[layer]}
            viewState={viewport}
            onViewStateChange={(viewState) => setViewport(viewState.viewState)}
        >
            <ReactMap
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MapboxAccessToken}
            />
        </DeckGL>
    )
}
export default Page;