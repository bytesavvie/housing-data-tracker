// React
import React from "react";

// Next
import { useRouter } from "next/router";

// D3-Geo
import { geoCentroid } from "d3-geo";

// React Simple Maps
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
} from "react-simple-maps";

// Utils
import { allStates } from "../../utils/USMap";
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface LabelOffsets {
  [key: string]: [number, number];
}

const labelOffsets: LabelOffsets = {
  vt: [50, -8],
  nh: [34, 2],
  ma: [30, -1],
  ri: [28, 2],
  ct: [35, 10],
  nj: [34, 1],
  de: [33, 0],
  md: [47, 10],
  dc: [49, 21],
};

interface Geo {
  geometry: { type: string; coordinates: number[][] };
  properties: { name: string };
  id: string;
  rsmKey: string;
  svgPath: null;
  type: string;
  geometries: any /* added to appease typescript in geoCentroid function, but doesn't seem to actually appear on the object or be needed at all. 
  should try and find a different solution later */;
}

const MapChart = () => {
  const router = useRouter();

  const handleStateClick = (geo: Geo) => {
    const selectedState = allStates.find((s) => s.val === geo.id);
    if (selectedState) {
      router
        .push(
          {
            pathname: `/state/${selectedState.id}`,
          },
          undefined
        )
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const convertStateAbreviationToId = () => {
    const stateId = router.query.stateid;

    if (typeof stateId === "string") {
      const selectedState = allStates.find((s) => s.id === stateId);
      return selectedState?.val;
    }
  };

  return (
    <ComposableMap projection="geoAlbersUsa">
      <Geographies geography={geoUrl}>
        {({ geographies }) => (
          <>
            {geographies.map((geo: Geo) => (
              <Geography
                onClick={() => handleStateClick(geo)}
                key={geo.rsmKey}
                stroke="#FFF"
                geography={geo}
                fill={
                  convertStateAbreviationToId() === geo.id.toLowerCase()
                    ? "grey"
                    : "#D3D3D3"
                }
                style={{
                  default: { outline: "none" },
                  hover: {
                    cursor: "pointer",
                    outline: "none",
                    fill:
                      convertStateAbreviationToId() === geo.id.toLowerCase()
                        ? "grey"
                        : "#e0e0e0",
                  },
                  pressed: { outline: "none" },
                }}
              />
            ))}
            {geographies.map((geo: Geo) => {
              const centroid = geoCentroid(geo);
              const cur = allStates.find((s) => s.val === geo.id);
              const labelOffset = cur ? labelOffsets[cur.id] : undefined;
              return (
                <g key={geo.rsmKey + "-name"}>
                  {cur &&
                    centroid[0] > -160 &&
                    centroid[0] < -67 &&
                    (labelOffset === undefined ? (
                      <Marker
                        onClick={() => handleStateClick(geo)}
                        coordinates={centroid}
                        style={{
                          hover: {
                            cursor: "pointer",
                          },
                        }}
                      >
                        <text y="2" fontSize={14} textAnchor="middle">
                          {cur.id}
                        </text>
                      </Marker>
                    ) : (
                      <Annotation
                        connectorProps={
                          <svg
                            width="100"
                            height="100"
                            viewBox="0 0 100 100"
                            xmlns="http://www.w3.org/2000/svg"
                          />
                        }
                        subject={centroid}
                        dx={labelOffset[0]}
                        dy={labelOffset[1]}
                        style={{ fill: "white", color: "white" }}
                      >
                        <text x={4} fontSize={14} alignmentBaseline="middle">
                          {cur.id}
                        </text>
                      </Annotation>
                    ))}
                </g>
              );
            })}
          </>
        )}
      </Geographies>
    </ComposableMap>
  );
};

export default MapChart;
