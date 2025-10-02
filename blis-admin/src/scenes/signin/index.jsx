import {Box, Container, Paper, Typography, TextField, Button,} from "@mui/material";
import {Link} from "react-router-dom";
import photo from "../../assets/logo1.jpg"
const Login = () => {

    const handleSubmit = () => <Link to="/home"/>;

    return (
        <Container maxWidth="xs" >
            <Paper elevation={10} sx={{marginTop: 25, padding:2, borderRadius:3}}>

                     <Box style={{marginBottom:"10px",  padding:"5px",}}>
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <img alt="profile-user"
                                width="100px"
                                height="100px"
                                src={photo}
                                style={{borderRadius:"50%"}}
                                />
                            </Box>
                        </Box>

                <Typography component="h1" variant="h5" sx={{textAlign:"center"}}>
                    Sign In
                </Typography>
                <Box
                    component="form"
                    onClick={handleSubmit}
                    noValidate
                    sx={{mt:2, padding:2}}
                >
                    <TextField 
                        placeholder="Enter Username"
                        fullWidth
                        required
                        autoFocus
                        sx={{mb:2}}
                    />
                    <TextField 
                        placeholder="Password"
                        fullWidth
                        required
                        type="password"
                        sx={{mb:2}}
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        fullWidth 
                        sx={{mt:1, background:"#4CAF50"}}
                    >
                        SIGN IN
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}

export default Login;