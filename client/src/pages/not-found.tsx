import React from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
	return (
		<Container style={{ paddingTop: 24 }}>
			<Typography variant="h5" component="h4" color="textSecondary" align="center">
				404 - Page not found
			</Typography>
			<Box display="flex" justifyContent="center" mt={3}>
				<Button
					size="large"
					variant="contained"
					color="secondary"
					disableElevation
					component={Link}
					to="/"
				>
					Go back home
				</Button>
			</Box>
		</Container>
	)
}
