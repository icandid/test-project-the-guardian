import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
// import CardMedia from '@material-ui/core/CardMedia'

export const PlaceholderShimmer: React.FC = () => {
	return (
		<Card>
			<div className="placeholder-shimmer" style={{ height: 140 }} />
			<CardContent>
				<div className="placeholder-shimmer" style={{ height: 24, marginBottom: 16 }} />
				<div className="placeholder-shimmer" style={{ height: 24, marginBottom: 16 }} />
				<div
					className="placeholder-shimmer"
					style={{ height: 24, width: '50%', marginBottom: 16 }}
				/>
			</CardContent>
		</Card>
	)
}
