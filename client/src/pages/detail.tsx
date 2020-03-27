import React, { useState, useEffect } from 'react'
import { Redirect, useLocation, useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

import { AlertError } from '../components/alert-error'
import { renderHTML } from '../utils/render-html'
import { Detail } from '../models'

const Loading: React.FC = () => {
	return (
		<div>
			<div className="placeholder-shimmer" style={{ height: 32, marginBottom: 16 }} />
			<div className="placeholder-shimmer" style={{ height: 32, marginBottom: 16 }} />
			<div
				className="placeholder-shimmer"
				style={{ height: 32, width: '50%', marginBottom: 32 }}
			/>
			<div className="placeholder-shimmer" style={{ height: 400, marginBottom: 32 }} />

			<div className="placeholder-shimmer" style={{ height: 24, marginBottom: 16 }} />
			<div className="placeholder-shimmer" style={{ height: 24, marginBottom: 16 }} />
			<div className="placeholder-shimmer" style={{ height: 24, marginBottom: 16 }} />
			<div className="placeholder-shimmer" style={{ height: 24, marginBottom: 16 }} />
			<div className="placeholder-shimmer" style={{ height: 24, marginBottom: 16 }} />
			<div className="placeholder-shimmer" style={{ height: 24, marginBottom: 16 }} />
		</div>
	)
}

export const DetailPage: React.FC = () => {
	const history = useHistory()
	const [data, setData] = useState<Detail | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState(false)
	const urlParams = new URLSearchParams(useLocation().search)
	const id = urlParams.get('id')

	useEffect(() => {
		let didCancel = false
		const fetchData = async () => {
			setIsLoading(true)
			setIsError(false)
			try {
				const response = await fetch(`http://localhost:3000/news?id=${id}`)
				const json = await response.json()
				if (!didCancel) {
					setData(json.data)
					setIsLoading(false)
				}
			} catch (e) {
				console.log(e)
				setIsError(true)
				setIsLoading(false)
			}
		}
		if (id) {
			fetchData()
		}
		return () => {
			didCancel = true
		}
	}, [id])

	if (!id) {
		return <Redirect to="/" />
	}

	if (isError) {
		return <AlertError />
	}

	if (isLoading || !data) {
		return (
			<Container style={{ paddingTop: 24 }}>
				<Loading />
			</Container>
		)
	}

	return (
		<Container style={{ paddingTop: 24 }}>
			<Chip color="secondary" label={data.sectionName} style={{ marginBottom: 8 }} />
			<Typography variant="h3" component="h2" gutterBottom>
				{data.fields.headline}
			</Typography>
			<Typography variant="subtitle1">By {data.fields.byline}</Typography>
			<Typography variant="body2">
				{new Date(data.webPublicationDate).toLocaleString()}
			</Typography>

			{/* <img src={data.fields.thumbnail} alt="Thumbnail" /> */}
			{renderHTML(data.fields.body)}

			<Button
				size="large"
				variant="contained"
				color="primary"
				disableElevation
				onClick={() => {
					history.goBack()
				}}
			>
				go back
			</Button>

			<div style={{ height: 40 }}></div>
		</Container>
	)
}
