import React from 'react';
import axios from 'axios';
import {withStyles} from '@material-ui/core/styles';
import './ClassTodo.css';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
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
    };

    handleClick = async (event) => {
        event.preventDefault();
        const response = await axios.get(`https://api.github.com/users/${this.state.userName}`);
        this.props.addEntry(response.data);
        console.log(response.data);
        this.setState({userName: ''});
    };

    render() {
        return (
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
        );
    };
}

class CardList extends React.Component {
    render() {
        return (
            <div style={{margin: '24px auto', width: '50%'}}>{this.props.profileList.map(profile => <Card
                key={profile.id} {...profile}/>)}</div>
        );
    };
};

class Card extends React.Component {
    render() {
        const profileData = this.props;
        return (
            <Paper style={{margin: '24px auto'}}>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={profileData.avatar_url}/>
                    </ListItemAvatar>
                    <ListItemText
                        primary={profileData.name}
                        secondary={
                            <React.Fragment>
                                <Typography component="span" color="textPrimary" style={{display: 'inline'}}>
                                    {profileData.location === null ? '' : profileData.location}
                                </Typography>
                                {profileData.company === null ? '' : '-' + profileData.company}
                            </React.Fragment>
                        }
                    />
                </ListItem>
            </Paper>
        );
    }
}

class ClassTodo extends React.Component {

    state = {
        profileList: [],
    };

    addProfileToList = (profile) => {
        this.setState(prevState => ({
            profileList: [...prevState.profileList, profile]
        }));
    };

    render() {
        const {classes} = this.props;
        return (
            <>
            <Header title="This is class based TODO List"/>
            <Form addEntry={this.addProfileToList} classes={classes}/>
            <CardList profileList={this.state.profileList}/>
            </>
        );
    }
}

export default withStyles(styles)(ClassTodo);