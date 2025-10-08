import {Typography, Box} from "@mui/material";

const Header = ({title, subtitle}) => {
  return <Box mb="20px">
    <Typography color="black" fontWeight="bold" sx={{mt: "15px",ml: "25px",mb:"5px", fontSize:"30px"}}>{title}</Typography>
    <Typography variant="h5" color="grey" sx={{ml:'25px',}}>{subtitle}</Typography>
  </Box>

}

export default Header;