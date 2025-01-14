import { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import { InputLabel } from '@mui/material';
import { motion } from "framer-motion";
import { Alert } from '../common/modal/Modal';
import { loginUser } from "../../actions/userAction";
import {useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { UserType } from "src/common/commonTypes";

const theme = createTheme({
    palette: {
      primary: {
        main: orange[500],
      },
    },
  });


export const Login:React.FC = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [openAlert, setOpenAlert] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>("");
    const [isIdSave, setIdSave] = useState<boolean>(false);
    const [cookies, setCookie, removeCookie] = useCookies<string>(["saveId"]);

    useEffect(() => {
        if(cookies.saveId !== undefined) {
          setEmail(cookies.saveId);
          setIdSave(true);
        }
     }, []);

    const navigate = useNavigate();

    const onEmailHandler = (event:React.ChangeEvent<HTMLInputElement>):void => {
        setEmail(event.currentTarget.value)
    }
    
    const onPasswordHandler = (event:React.ChangeEvent<HTMLInputElement>):void => {
        setPassword(event.currentTarget.value)
    }

    const onCloseAlertHandler = ():void => setOpenAlert(false);

    const onSaveIdHandler = (event:React.ChangeEvent<HTMLInputElement>):void => setIdSave(event.target.checked);


    const showErrorMsg = (err:string = '오류가 발생하였습니다.'):void => {
        setOpenAlert(true);
        setMsg(err);
    }

    const onEnterHandler = (event:React.KeyboardEvent):void => {
        if(event.key === 'Enter') {
        onSubmitHandler();
        }
      }

    const onSubmitHandler = ():void => {
        let errorMsg:string = '';
        setMsg(errorMsg);
        if(!email) errorMsg += '이메일을 입력해주세요';
        if(!password) errorMsg += (!!errorMsg ? '\n' : '') + '비밀번호를 입력해주세요';


        if(!!errorMsg) {
            showErrorMsg(errorMsg);
            return;
        }

        const data:UserType = {
            email: email,
            password: password
        };

        loginUser(data)
        .then((res) => {
            console.log(res);
            if(!!res && !!res.result) {
                const result = res.result;
                if(result == 'success' && !!res.token) {
                    sessionStorage.setItem("isAuthorized", res.token);
                    console.log(res.token);
                    if(isIdSave) {
                        setCookie('saveId', email, {maxAge: 15*24*60*60});
                    } else {
                        removeCookie('saveId');
                    }
                    navigate('/', { replace: true});
                    return;
                } else if(result == 'fail' && !!res.msg) {
                    showErrorMsg(res.msg);
                    return;
                }
            }
            showErrorMsg();
            
        })
        .catch((err) => {
            console.log(err);
            showErrorMsg();
        });

    }
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs" onKeyDown={onEnterHandler}>
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    
                    >
                        <Typography component='h1' variant='h3' color='#fe921f'>
                            Figure
                        </Typography>
                        <TextField 
                            label='Email' 
                            name='email'
                            autoComplete='eamil'
                            margin='normal'
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><PersonOutlineIcon/></InputAdornment>,
                            }}
                            autoFocus
                            required
                            fullWidth
                            onChange={onEmailHandler}
                            value={email}
                        />
                        <TextField 
                            label='Password'
                            name='password' 
                            type='password' 
                            margin='normal'
                            autoComplete='current-password'
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><LockOpenIcon/></InputAdornment>,
                            }}
                            required
                            fullWidth
                            onChange={onPasswordHandler}
                        />
                        <Grid container>
                            {/* <Grid item>
                                <FormControlLabel 
                                    control={<Checkbox value='maintainLogin' color='primary' />} 
                                    label='로그인 유지'
                                />
                            </Grid> */}
                            <Grid item>
                                <FormControlLabel 
                                    control={<Checkbox value='saveId' color='primary' onChange={onSaveIdHandler} checked={isIdSave}/>} 
                                    label='아이디 저장'
                                />
                            </Grid>
                        </Grid>
                
                        <Button 
                            variant='contained' 
                            size='large'
                            fullWidth
                            sx={{ mt: 3, mb:2, color: 'white'}}
                            onClick={onSubmitHandler}
                        >
                            로그인
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/signUp" underline="none">회원가입</Link>
                            </Grid>
                            <Grid item>
                                <Link href="/passwordFinder" underline="none">비밀번호 찾기</Link>
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid item xs>
                                <InputLabel sx={{ mt: 3, mb:3, fontWeight: 'bold'}}>
                                    다른정보로 로그인
                                </InputLabel>
                            </Grid>
                        </Grid>
                        
                        <Grid container>
                            <Grid item xs>
                                <Button 
                                    type='submit' 
                                    variant='contained' 
                                    size='large'
                                    sx={{color: 'white', backgroundColor: 'rgb(52 152 219)'}}
                                >
                                    페이스북
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button 
                                    type='submit' 
                                    variant='contained' 
                                    size='large'
                                    sx={{color: 'white', backgroundColor: 'rgb(236, 243, 26)'}}
                                >
                                    카카오
                                </Button>
                            </Grid>
                        </Grid>                   
                    </Box>
                    <Alert open={openAlert} onClose={onCloseAlertHandler} message={msg} title={""}/>
                </Container>
            </ThemeProvider>
        </motion.div>
    )
}