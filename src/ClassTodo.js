import React from 'react';
import axios from 'axios';
import {withStyles} from '@material-ui/core/styles';
import './ClassTodo.css';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '60%',
        margin: 'auto',
    },
    input: {
        marginLeft: 8,
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        width: 1,
        height: 28,
        margin: 4,
    },
};

class Header extends React.Component {
    render() {
        return (
            <div style={{fontWeight: '600', fontSize: '18px', margin: '24px auto'}}>{this.props.title}</div>
        );
    }
}

class Form extends React.Component {
    state = {
        userName: '',
        open: false,
        message: 'User not found. Please try someother keywords.'
    };

    handleClick = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`https://api.github.com/users/${this.state.userName}`);
            let status = this.props.addEntry(this.state.userName, response.data);
            this.setState({userName: ''});
            if(!status) {
                this.setState({
                    open: true,
                    message: 'User is already exist in your  list.',
                });
            }
        } catch (err) {
            this.setState({
                open: true,
                message: 'User not found. Please try someother keywords.',
            });
        }

    };

    handleClose = () => {
        this.setState({
            open: false,
        });
    };

    render() {
        return (
            <>
            <Paper className={this.props.classes.root} elevation={1}>
                <IconButton className={this.props.classes.iconButton} aria-label="Menu">
                    <MenuIcon/>
                </IconButton>
                <InputBase className={this.props.classes.input} placeholder="Type username here to add!!!"
                           value={this.state.userName}
                           onChange={(event) => this.setState({userName: event.target.value})}/>
                <IconButton className={this.props.classes.iconButton} aria-label="Search" onClick={this.handleClick}>
                    <SearchIcon/>
                </IconButton>
            </Paper>
            <MySnackBars open={this.state.open} message={this.state.message} hideBar={this.handleClose}/>
            </>
        );
    };
}

class CardList extends React.Component {

    removeData = (key) => {
        this.props.removeFromProfile(key);
    };

    render() {
        return (
            <div style={{
                margin: '24px auto',
                width: '50%'
            }}>{this.props.profileList.map(profile => <Card
                key={profile.id} {...profile} removeFromProfile={this.removeData}/>)}</div>
        );
    };
};

class Card extends React.Component {

    handleHover = () => {
        this.setState({
            isDisplay: true,
        });
    };

    handleMouseout = () => {
        this.setState({
            isDisplay: false,
        });
    };

    state = {
        isDisplay: false,
    };


    removeFromProfile = (event) => {
        this.props.removeFromProfile(this.props);
    };

    render() {
        const profileData = this.props;

        return (

            <div onMouseOver={this.handleHover} onMouseOut={this.handleMouseout}>
                <Paper className="profileCard">
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src={profileData.avatar_url}/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={profileData.name}
                            secondary={
                                <React.Fragment>
                                    <Typography component="span" color="textPrimary"
                                                style={{display: 'inline'}}>
                                        {profileData.location === null ? '' : profileData.location}
                                    </Typography>
                                    {profileData.company === null ? '' : '-' + profileData.company}
                                </React.Fragment>
                            }
                        />
                        <IconButton name="md-close" style={{
                            position: 'relative',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            display: this.state.isDisplay ? 'block' : 'none',
                        }} onClick={this.removeFromProfile}><CloseIcon/></IconButton>
                    </ListItem>
                </Paper>
            </div>
        );
    }
}

class MySnackBars extends React.Component {

    render() {
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={this.props.open}
                autoHideDuration={100}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                className="snackBarRoot"
                message={<span id="message-id">{this.props.message}</span>}
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={this.props.hideBar}
                    >
                        <CloseIcon/>
                    </IconButton>,
                ]}
            />
        );
    }
}

class ClassTodo extends React.Component {

    state = {
        profileList: [],
    };

    addProfileToList = (key, profile) => {
        for (var i = 0; i < this.state.profileList.length; i++) {
            if (JSON.stringify(this.state.profileList[i]) === JSON.stringify(profile)) {
                return false;
            }
        }
        this.setState(prevState => ({
            profileList: [...prevState.profileList, profile]
        }));
        return true;
    };

    removeFromProfile = (key) => {
        let index = -1;
        let newArray = [];
        for (var i = 0; i < this.state.profileList.length; i++) {
            if (JSON.stringify(this.state.profileList[i]) !== JSON.stringify(key)) {
                newArray.push(this.state.profileList[i]);
            }
        }
        this.setState({
            profileList: newArray,
        });

    };

    render() {
        const {classes} = this.props;
        return (
            <>
            <Header title="This is class based TODO List"/>
            <Form addEntry={this.addProfileToList} classes={classes}/>
            <CardList profileList={this.state.profileList} removeFromProfile={this.removeFromProfile}/>
            </>
        );
    }
}

export default withStyles(styles)(ClassTodo);