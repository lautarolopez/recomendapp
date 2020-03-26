import React, { useEffect, useState } from 'react'
import './styles.css'
import { Typography, Paper, Avatar, Button,  List, ListItem, ListItemText } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import VerifiedUserOutlined from '@material-ui/icons/VerifiedUserOutlined'
import withStyles from '@material-ui/core/styles/withStyles'
import firebase from '../firebase'
import { withRouter } from 'react-router-dom'

const styles = theme => ({
	main: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		marginLeft: theme.spacing() * 3,
		marginRight: theme.spacing() * 3,
		[theme.breakpoints.up(400 + theme.spacing() * 3 * 2)]: {
			width: 400,
			marginLeft: 'auto',
			marginRight: 'auto',
		},
	},
	paper: {
		marginTop: theme.spacing() * 8,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing() * 2}px ${theme.spacing() * 3}px ${theme.spacing() * 3}px`,
	},
	avatar: {
		margin: theme.spacing(),
		backgroundColor: theme.palette.secondary.main,
	},
	submit: {
		marginTop: theme.spacing() * 3,
	},
})

function Profile(props) {
	const { classes } = props
	const [isUserLoggedIn, setUserLoggedIn] = useState(true)
    const [typeOfContent, setTypeOfContent] = useState("movies")
    const [profileMovies, setProfileMovies] = useState([])
    const [profileSeries, setProfileSeries] = useState([])
    const [dataFetched, setDataFetched] = useState(false)

    const handleTypeOfContent = (event, newTypeOfContent) => {
        setTypeOfContent(newTypeOfContent)
    }

    async function fetchId(id, type){
        await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=8acf7117c6859db295df155d5626c31a&language=es-AR&include_image_language=es-AR`)
				.then(function (response){
					return response.json()
				})
				.then(function (data){
					 if (type === "movie"){
                         let aux = profileMovies
                         aux.push(data)
                         setProfileMovies(aux)
                     } else {
                        let aux = profileSeries
                        aux.push(data)
                        setProfileSeries(aux)
                     }
				})
				.catch(function(err){
					console.log(err)
				})
    }

    async function fetchItemsData(moviesList, seriesList){
        if (moviesList.length !== 0) {
			moviesList.forEach((movie_id => {
                fetchId(movie_id, "movie")
            }))
        }
        if (seriesList.length !== 0) {
			seriesList.forEach((serie_id => {
                fetchId(serie_id, "tv");
            }))
        } 
        setDataFetched(true)
    }   

	// eslint-disable-next-line
	useEffect(() => {
		if (!firebase.getCurrentUsername()) {
			setUserLoggedIn(false)
			alert('Please login first')
			props.history.replace('/login')
		} else {
            firebase.getCurrentUserLists().then((lists =>{
                if (!dataFetched) {
                    fetchItemsData(lists.movies, lists.series)
                }
            })) 
		}
	// eslint-disable-next-line
	})

	return (
		
		<main className={classes.main}>
			{isUserLoggedIn ? (
			<Paper className={classes.paper}>
				<Avatar className={classes.avatar}>
					<VerifiedUserOutlined />
				</Avatar>
				<Typography component="h1" variant="h5">
					Hello { firebase.getCurrentUsername() }
				</Typography>
                <br/>
				<ToggleButtonGroup
                    value={typeOfContent}
                    exclusive
                    onChange={handleTypeOfContent}
                >
                    <ToggleButton value="movies" aria-label="Movies">
                        Movies
                    </ToggleButton>
                    <ToggleButton value="series" aria-label="Series">
                        Series
                    </ToggleButton>
                </ToggleButtonGroup>
                <List>
                    {typeOfContent === "movies" ? 
                    (
                    profileMovies.map((movie) => <ListItem key={movie.id}> <ListItemText>{movie.title}</ListItemText> </ListItem>)
                    )
                    :
                    (<Typography>ESTÁS VIENDO SERIES</Typography>)}
				</List>
				<Button
					type="submit"
					fullWidth
					variant="contained"
					color="secondary"
					onClick={logout}
					className={classes.submit}>
					Logout
          		</Button>
			</Paper>
			)
			:
			( <Typography>NO ESTÁS LOGUEADO QUÉ HACÉS ACÁ</Typography>)}
		</main>
	)


	async function logout() {
		await firebase.logout()
		props.history.push('/')
	}
}

export default withRouter(withStyles(styles)(Profile))