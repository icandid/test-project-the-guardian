import React from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'

function Alert(props: AlertProps) {
	return <MuiAlert elevation={6} variant="filled" {...props} />
}

export const AlertError: React.FC = () => {
	const action = (
		<Button size="small" style={{ color: '#fff' }} onClick={() => window.location.reload()}>
			Reload
		</Button>
	)
	return (
		<Box mb={3}>
			<Alert severity="error" elevation={0} action={action}>
				Something wrong please try again!
			</Alert>
		</Box>
	)
}
