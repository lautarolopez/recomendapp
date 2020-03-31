import React, { useEffect, useState } from 'react'
import './styles.css'
import { Typography, Paper, Avatar,  List, ListItem, Card, CardHeader, CardContent, CardActionArea, Button } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import PersonIcon from '@material-ui/icons/Person';
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
	const [profilePicture, setProfilePicture] = useState("")

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
		}
        firebase.getUserLists(props.match.params.id).then((lists =>{
            if (!dataFetched) {
				fetchItemsData(lists.movies, lists.series)
				firebase.getUserAvatarWithId(props.match.params.id).then((photoURL) => {
					setProfilePicture(photoURL)
				})
			}
		}))
		
	// eslint-disable-next-line
	})

	return (
		
		<main className={classes.main}>
			<Paper className={classes.paper}>
				{profilePicture !== "" ? (
				<Avatar alt="profile" src={profilePicture} className={props.large}/>)
				:
				(<Avatar className={props.purple}>
					<PersonIcon />
				</Avatar>) }
				<Typography component="h1" variant="h5" align="center">
					{/* { firebase.getCurrentUsername() } */}
				</Typography>
                <br/>
				<ToggleButtonGroup
                    value={typeOfContent}
                    exclusive
                    onChange={handleTypeOfContent}
                >
                    <ToggleButton value="movies" aria-label="Movies">
                        Pelis
                    </ToggleButton>
                    <ToggleButton value="series" aria-label="Series">
                        Series
                    </ToggleButton>
                </ToggleButtonGroup>
                <List>
                    {typeOfContent === "movies" ? 
                    (
                    profileMovies.map((movie) => 
					<ListItem key={movie.id}> 
						<Card variant="outlined">
								<CardHeader title={ movie.title }> </CardHeader>
								<CardContent> 
									<Typography variant="body2" component="p">
										{ movie.overview }
									</Typography>
									<img src={movie.poster_path !== null ? 
										("https://image.tmdb.org/t/p/w500" + movie.poster_path)
										:
										("https://www.themoviedb.org/assets/2/v4/logos/208x226-stacked-green-9484383bd9853615c113f020def5cbe27f6d08a84ff834f41371f223ebad4a3c.png") }
									alt={movie.title}
									/> 
									{isUserLoggedIn ? 
									(<Button>
										Quitar de mi lista
									</Button>)
									:
									(<Button>
										Agregar a mi lista
									</Button>)}
								</CardContent>
						</Card> 
						</ListItem>
					)
                    )
                    :
                    (
                        profileSeries.map((serie) => 
						<ListItem key={serie.id}> 
							<Card variant="outlined">
									<CardHeader title={ serie.name }> </CardHeader>
									<CardContent> 
										<Typography variant="body2" component="p">
											{ serie.overview }
										</Typography>
										<img src={serie.poster_path != null ? 
											("https://image.tmdb.org/t/p/w500" + serie.poster_path)
											:
											("https://www.themoviedb.org/assets/2/v4/logos/208x226-stacked-green-9484383bd9853615c113f020def5cbe27f6d08a84ff834f41371f223ebad4a3c.png") }
										alt={serie.title}
										/>
										{isUserLoggedIn ? 
										(<Button>
											Quitar de mi lista
										</Button>)
										:
										(<Button>
											Agregar a mi lista
										</Button>)} 
									</CardContent>
							</Card> 
						</ListItem>
					)
                    )}
				</List>
			</Paper>
		</main>
	)

}

export default withRouter(withStyles(styles)(Profile))