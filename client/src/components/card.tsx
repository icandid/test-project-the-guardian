import React from 'react'
import MuiCard from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'
import { Post } from '../models'

type Props = {
	data: Post
	onClick: () => void
}

export const Card: React.FC<Props> = ({ data, onClick }) => {
	const imgSrc =
		(data.fields && data.fields.thumbnail) ||
		'https://via.placeholder.com/500x300.png/eeeeee/eeeeee?text=No%20Image'

	return (
		<MuiCard onClick={onClick} style={{ cursor: 'pointer', position: 'relative' }}>
			<Chip
				size="small"
				color="secondary"
				label={data.sectionName}
				style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}
			/>
			<CardMedia
				component="img"
				alt={data.webTitle}
				height="140"
				image={imgSrc}
				title={data.webTitle}
			/>
			<CardContent>
				<Typography variant="h6" component="h3" gutterBottom>
					{data.webTitle}
				</Typography>
				<Typography variant="body2" component="p">
					{new Date(data.webPublicationDate).toLocaleDateString()}
				</Typography>
			</CardContent>
		</MuiCard>
	)
}
