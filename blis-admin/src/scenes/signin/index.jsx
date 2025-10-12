import { useState,useEffect  } from "react";
import {Box, Container, Paper, Typography, TextField, Button,} from "@mui/material";
import {useNavigate, useLocation} from "react-router-dom";
import photo from "../../assets/logo1.jpg"

const Login = () => {

    const [email, setEmail] = useState('');
    const [password,setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    
     // ✅ Clear inputs when this page is visited
    useEffect(() => {

        if (location.pathname === '/'){
            setEmail("");
            setPassword("");
        }
        
    }, [location]);

    const handleClick = () => {

        if (email === 'admin' && password === '12345') {
            setEmail("");
            setPassword("");
            return navigate('/dashboard');
        } else{
            setEmail("");
            setPassword("");
            alert("Wrong Inputs")
        }
        
    };

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
                    noValidate
                    sx={{mt:2, padding:2}}
                >
                    <TextField 
                        placeholder="Enter Username"
                        value={email}
                        onChange={(e) => {setEmail(e.target.value)}}
                        fullWidth
                        required
                        autoFocus
                        sx={{mb:2}}
                    />
                    <TextField 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {setPassword(e.target.value)}}
                        fullWidth
                        required
                        type="password"
                        sx={{mb:2}}
                    />
                    <Button 
                        variant="contained" 
                        fullWidth 
                        sx={{mt:1, background:"#4CAF50"}}
                        onClick={handleClick}
                    >
                        SIGN IN
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}

export default Login;