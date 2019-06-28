import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom'

const useStyles = makeStyles({
    card: {
        minWidth: 240,
        margin: '20px 15px',
        padding: '20px'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function SimpleCard(props) {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography variant="h5" component="h2">
                    {props.room.name}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                    {`${props.room.player_num} players waiting`}
                </Typography>
                {/* <Typography variant="body2" component="p"> */}
                {/*         well meaning and kindly. */}
                {/*     <br /> */}
                {/*         {'"a benevolent smile"'} */}
                {/* </Typography> */}
            </CardContent>
            <CardActions>
                <Link to={`/rooms/${props.room.primary_k}`}><Button variant="outlined" size="small" color='primary'> 
                    ENTER
                </Button></Link>
            </CardActions>
        </Card>
    );
}
