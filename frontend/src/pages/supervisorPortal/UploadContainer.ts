// import { styled } from "@mui/system";
// import { grey } from "@mui/material/colors";

// interface Props {
//   //https://stackoverflow.com/a/64157580/343900
//   accepted: number;
//   disabled: boolean;
// }

// const UploadContainer = styled("div")<Props>(
//   ({ theme, accepted, disabled }) => {
//     const getColor = () => {
//       switch (true) {
//         case Boolean(accepted):
//           return theme.palette.success.main;
//         case disabled:
//           return grey[600];
//         default:
//           return theme.palette.primary.dark;
//       }
//     };

//     return {
//       color: getColor(),
//       borderColor: getColor(),
//       cursor: disabled ? "default" : "pointer",
//       flex: 1,
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       padding: "20px",
//       borderWidth: "2px",
//       borderRadius: "2px",
//       borderStyle: "dashed",
//       outline: "none",
//       transition: "border 0.24s ease-in-out"
//     };
//   }
// );

// export default UploadContainer;
