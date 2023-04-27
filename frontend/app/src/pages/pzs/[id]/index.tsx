// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import axios from "../../../../lib/axiosInstance";
// import { TextField, Box, Button, Grid } from "@mui/material";
// import Mapbox from "components/Mapbox";

// const PzEdit: React.FC = () => {
//   const router = useRouter();
//   const { id } = router.query;
//   const [pz, setPz] = useState(null);

//   useEffect(() => {
//     if (id) {
//       getPzData();
//     }
//   }, [id]);

//   const getPzData = async () => {
//     try {
//       const response = await axios.get(`/prohibited_zones/${id}`);
//       setPz(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   if (!pz) return <div>Loading...</div>;

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
//       <div>
//         <Box mb={4}>
//           <TextField label="ID" value={pz.id} type="text" InputProps={{ readOnly: true }} />
//           <TextField label="Name" value={pz.name} type="text" InputProps={{ readOnly: true }} />
//           <TextField label="Longitude" value={pz.longitude} type="number" InputProps={{ readOnly: true }} />
//           <TextField label="Latitude" value={pz.latitude} type="number" InputProps={{ readOnly: true }} />
//           <TextField label="Radius" value={pz.radius} type="number" InputProps={{ readOnly: true }} />
//           <TextField label="Altitude" value={pz.altitude} type="number" InputProps={{ readOnly: true }} />
//           <TextField label="Type" value={pz.pz_type} type="text" InputProps={{ readOnly: true }} />
//         </Box>
//       </div>
//       <div style={{ flexGrow: 1, position: "relative", height: "400px", marginBottom: "32px" }}>
//         <Mapbox
//           longitude={parseFloat(pz.longitude)}
//           latitude={parseFloat(pz.latitude)}
//           radius={parseFloat(pz.radius)}
//           altitude={parseFloat(pz.altitude)}
//           color={[255, 0, 0, 255]}
//         />
//       </div>
//       <Grid container justifyContent="flex-start">
//         <Grid item>
//           <Button
//             variant="outlined"
//             style={{ color: "white", backgroundColor: "#b8b8b8", border: "none", borderRadius: 20 }}
//             onClick={() => router.back()}
//           >
//             戻る
//           </Button>
//         </Grid>
//       </Grid>
//     </div>
//   );
// };

// export default PzEdit;
