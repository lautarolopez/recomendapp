import React, { useEffect, useState } from 'react'
import { Typography, Paper, Avatar, Button, Input, InputLabel, FormControl } from '@material-ui/core'
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

function Dashboard(props) {
	const { classes } = props
	const [isUserLoggedIn, setUserLoggedIn] = useState(true)
	const [querySearch, setQuerySearch] = useState('')

	useEffect(() => {
		if (!firebase.getCurrentUsername()) {
			setUserLoggedIn(false)
			alert('Please login first')
			props.history.replace('/login')
		} else {
			
		}
	// eslint-disable-next-line
	}, [])

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
						<InputLabel htmlFor="querySearch">Search for a movie or TV Show</InputLabel>
						<Input id="querySearch" name="querySearch" autoComplete="off" autoFocus value={querySearch} onChange={e => setQuerySearch(e.target.value)} />
					</FormControl>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						onClick={search}
						className={classes.submit}>
						Search
          			</Button>
				</form>
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
		await fetch(`https://api.themoviedb.org/3/search/movie?api_key=8acf7117c6859db295df155d5626c31a&query=${querySearch}`)
			.then(function (response){
				return response.json()
			})
			.then(function (data){
				console.log(data.results[0].title)
			})
			.catch(function(err){
				console.log(err)
			})

	}

	async function logout() {
		await firebase.logout()
		props.history.push('/')
	}
}

export default withRouter(withStyles(styles)(Dashboard))