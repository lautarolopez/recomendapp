import React, { useEffect, useState } from 'react'
import './styles.css'
import { Typography, Paper, Avatar, Button, Input, InputLabel, FormControl, List, ListItem, ListItemText, InputAdornment } from '@material-ui/core'
import VerifiedUserOutlined from '@material-ui/icons/VerifiedUserOutlined'
import SearchIcon from '@material-ui/icons/Search';
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

function Dashboard(props) {
	const { classes } = props
	const [isUserLoggedIn, setUserLoggedIn] = useState(true)
	const [querySearch, setQuerySearch] = useState('')
	const [searchResults, setSearchResults] = useState([])

	// eslint-disable-next-line
	useEffect(() => {
		if (!firebase.getCurrentUsername()) {
			setUserLoggedIn(false)
			alert('Please login first')
			props.history.replace('/login')
		} else {
			search()
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
				<form className={classes.form} onSubmit={e => e.preventDefault() && false}>
					<FormControl margin="normal" fullWidth>
						<InputLabel htmlFor="querySearch">Buscá una película o serie</InputLabel>
						<Input id="querySearch" name="querySearch" autoComplete="off" endAdornment={<InputAdornment position="end"><SearchIcon></SearchIcon></InputAdornment>} autoFocus value={querySearch} onChange={e => setQuerySearch(e.target.value)} />
					</FormControl>
				</form>
				<List>
					{(querySearch.length !== 0) ? (searchResults.map((movie) => 
						<ListItem key={movie.id} onClick={() => firebase.storeNewItem(movie)} >
							<img src={movie.poster_path != null ? 
							("https://image.tmdb.org/t/p/w200" + movie.poster_path)
							:
							("https://www.themoviedb.org/assets/2/v4/logos/208x226-stacked-green-9484383bd9853615c113f020def5cbe27f6d08a84ff834f41371f223ebad4a3c.png") } 
							alt={movie.title} />
							<ListItemText inset primary={movie.release_date ? (movie.name ? movie.name : movie.title + " (" + movie.release_date.slice(0, 4) +")") : (movie.name ? (movie.first_air_date ? (movie.name + " (" + movie.first_air_date.slice(0, 4) + ")") : movie.name) : movie.title)} />
						</ListItem>)) 
					: 
					(<p className="noVisible">No buscaste nada cruck</p>)}
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

	async function search(){
		if (querySearch.length !== 0) {
			await fetch(`https://api.themoviedb.org/3/search/multi?api_key=8acf7117c6859db295df155d5626c31a&query=${querySearch}&language=es-AR&include_image_language=es-AR`)
				.then(function (response){
					return response.json()
				})
				.then(function (data){
					 let arrAux = [];
					 data.results.slice(0, 50).forEach(item => {
						if (!item.known_for_department){
							arrAux.push(item);
						}
					 })
					setSearchResults(arrAux.slice(0, 5))
				})
				.catch(function(err){
					console.log(err)
				})
		}
	}

	async function logout() {
		await firebase.logout()
		props.history.push('/')
	}
}

export default withRouter(withStyles(styles)(Dashboard))