import React, { useState, useEffect } from 'react';

import Amplify from '@aws-amplify/core';
import awsmobile from '../aws-exports';
import { isLoggedIn } from '../services/auth/user.service';

import { Link } from 'react-router-dom';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import ListItem from '@mui/material/ListItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { Menu, MenuItem, Divider } from '@mui/material';
import { Auth } from 'aws-amplify';
import { Hub } from 'aws-amplify';


Amplify.configure(awsmobile);

export const NavigationBar = () => {

  const classes = useStyles();
  // const [open, setOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(Boolean);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const isAuthenticated = async () => {
    setIsAuth(await isLoggedIn());
  }

  const listener = async (data) => {
    switch (data.payload.event) {
      case 'signIn':
          // logger.info('user signed in');
          setIsAuth(await isLoggedIn());
          break;
      // case 'signUp':
      //     logger.info('user signed up');
      //     break;
      // case 'signOut':
      //     logger.info('user signed out');
      //     break;
      // case 'signIn_failure':
      //     logger.error('user sign in failed');
      //     break;
      // case 'tokenRefresh':
      //     logger.info('token refresh succeeded');
      //     break;
      // case 'tokenRefresh_failure':
      //     logger.error('token refresh failed');
      //     break;
      // case 'configured':
      //     logger.info('the Auth module is configured');
    }
  }

  Hub.listen('auth', listener);


  async function signOut() {
    try {
      console.log("HELLO???");
      await Auth.signOut();
      setIsAuth(await isLoggedIn());
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }
  
  useEffect(() => {
    isAuthenticated();
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
       <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <AppBar position={'fixed'} className={clsx(open, classes.appBar)}>
          <Toolbar className={classes.toolbar}>
              <CssBaseline />
                  <Link className={classes.title} to="/">
                    <ListItem button>
                      <Typography
                        component={'h1'}
                        variant={'h6'}
                        color={'inherit'}
                        noWrap
                        className={classes.title}
                      >
                      Mind Manor
                    </Typography>
                    </ListItem>
                  </Link>
                  <div className={classes.link_group}>

                    {isAuth && (
                      
                    <Button className={classes.menuButton} component={Link} to="/create" variant={'contained'}>
                      Create Blog
                    </Button>
                    )}
                    
                    {isAuth && (
                      <div className={classes.accountIconDiv}>
                        <AccountCircle onClick={handleClick} className={classes.accountIcon} fontSize='large' color='#fff' />
                      </div>
                    )}
                    {!isAuth && (
                      <Button className={classes.menuButton} component={Link} to="/welcome" variant={'contained'}>
                        Get Started
                      </Button>
                    )}

                    <Menu
                      anchorEl={anchorEl}
                      open={open}
                      id="simple-menu"
                      onClose={handleClose}
                      onClick={handleClose}
                      placement="bottom-start"
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                          mt: 1.5,
                          '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem className={classes.menuItem}>
                        <LibraryBooksIcon />
                        <Typography className={classes.menuLabel}>My Blogs</Typography>
                      </MenuItem>
                      <Divider />

                          <MenuItem onClick={signOut} className={classes.menuItem}>
                            <LogoutIcon />
                            <Typography className={classes.menuLabel}>Logout</Typography>
                          </MenuItem>
                      
                    </Menu>
                  </div>
          </Toolbar>
        </AppBar>
      </main>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'top',
    marginTop: '50px'
  },
  toolbar: {
    padding: '0 5%'
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  accountIconDiv: {
    display: 'flex',
    color: 'white',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    '&:hover': {
      cursor: 'pointer',
    }
  },
  accountIcon: {
    color: 'white !important',
    fill: 'white'
  },
  menuButton: {
    backgroundColor: '#f4f4f4',
    color: '#032e3b',
    marginLeft: 16,
    '&:hover': {
      filter: 'brightness(95%)',
      backgroundColor: '#f4f4f4'
    }
  },
  menuItem: {
    padding: '.6em 2em'
  },
  menuLabel: {
    paddingLeft: '1em'
  },
  menuButtonHidden: {
    display: 'none'
  },
  link: {
    color: 'white',
    fontFamily: 'Open Sans',
    fontSize: 18,
    textDecoration: 'none'
  },
  link_group: {
    overflow: 'hidden',
    display: 'flex',
    flex: '1 0 auto',
    justifyContent: 'flex-end'
  },
  appBar: {
    background: 'radial-gradient(#040b0f, #023847)'
  },
  appBarSpacer: theme.mixins.toolbar,
  title: {
    color: 'white',
    fontFamily: 'Open Sans',
    fontSize: 30,
    textDecoration: 'none!important'
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  }
}));
