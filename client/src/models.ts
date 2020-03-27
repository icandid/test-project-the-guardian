export type Post = {
	id: string
	webPublicationDate: Date
	webTitle: string
	sectionName: string
	fields: {
		trailText: string
		thumbnail?: string
	}
}

export type Detail = {
	id: string
	webPublicationDate: Date
	sectionName: string
	fields: {
		headline: string
		byline: string
		body: string
		thumbnail?: string
	}
}
