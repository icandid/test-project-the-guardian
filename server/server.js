const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
const helmet = require('helmet')

const RequestError = require('./utils/request-error')

const PORT = process.env.PORT || 3000

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())
app.use(cors())

function generateURL(route, queryString) {
	let url = `https://content.guardianapis.com/${route}?api-key=f9ae8e6a-8183-4c0e-bdec-b1065e297ef8`

	if (queryString) {
		let parseQueryString = ''
		for (let [key, value] of Object.entries(queryString)) {
			parseQueryString += `&${key}=${value}`
		}

		url += parseQueryString
	}

	return url
}

app.get('/search', async (req, res) => {
	const { q = '', page = 1, pageSize = 20, orderBy = 'newest' } = req.query
	const url = generateURL('search', {
		q,
		page,
		'page-size': pageSize,
		'order-by': orderBy,
		'show-fields': 'thumbnail,trailText,starRating',
	})

	function hasNextPage(data) {
		const { pageSize, currentPage, pages, results } = data

		if (pages === 0 || currentPage === pages || results.length < pageSize) {
			return false
		}

		return true
	}

	try {
		const response = await fetch(url, {
			method: 'get',
			headers: { 'Content-Type': 'application/json' },
		})
		const data = await response.json()

		if (data.response.status === 'ok') {
			const { results, currentPage } = data.response
			return res.json({
				data: results,
				currentPage,
				hasNextPage: hasNextPage(data.response),
			})
		}

		return new RequestError(new RequestError('Request error', response))
	} catch (error) {
		console.log(error)
		res.status(400).json({
			error,
		})
	}
})

app.get('/news', async (req, res) => {
	const id = req.query.id
	if (!id) {
		res.type('text/plain')
		res.status(404)
		return res.send('404 - Not Found')
	}

	try {
		const response = await fetch(
			generateURL(id, {
				'show-fields': 'all',
			})
		)
		const data = await response.json()
		if (data.response.status === 'ok') {
			return res.json({
				data: data.response.content,
			})
		}
	} catch (error) {
		console.log(error)
		res.status(400).json({
			error,
		})
	}
})

app.use((req, res) => {
	res.type('text/plain')
	res.status(404)
	res.send('404 - Not Found')
})

app.use((err, req, res, next) => {
	console.log(err.message)
	res.type('text/plain')
	res.status(500)
	res.send('500 - Server Error')
})

app.listen(PORT, () =>
	console.log(`Express started on http://localhost:${PORT}`, 'press Ctrl-C to terminate.')
)
