import React, { useState } from "react";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import axios from "../../lib/axiosInstance";

const ExportCylinder: React.FC = () => {
  const [radius, setRadius] = useState(5);
  const [altitude, setAltitude] = useState(10);

  const exportCylinder = () => {
    // Create a cylindrical 3D object
    const geometry = new THREE.CylinderGeometry(radius, radius, altitude, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.4,
    });
    const cylinder = new THREE.Mesh(geometry, material);

    console.log('cylinder')
    console.log(cylinder)

    // Export the 3D object in GLTF format and send it to the server
    const exporter = new GLTFExporter();
    const filename = 'pz.gltf';
    exporter.parse(
      cylinder,
      (gltf) => {
        const blob = new Blob([JSON.stringify(gltf)], { type: "model/gltf+json" });
        const formData = new FormData();
        formData.append("file", blob, filename);
        console.log('formData')
        console.log(formData)
        axios
          .post("/prohibited_zones/create_obj", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      },
      (progress) => {
        console.log("Export progress:", progress);
      }
    );
    
  };

  return (
    <div>
      <button onClick={exportCylinder}>Export Cylinder</button>
    </div>
  );
};

export default ExportCylinder;
