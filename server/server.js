const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')

const RequestError = require('./utils/request-error')

const PORT = process.env.PORT || 3000

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
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
	const url = generateURL('search', {
		'show-fields': '',
	})

	try {
		const response = await fetch(url, {
			method: 'get',
			headers: { 'Content-Type': 'application/json' },
		})
		const data = await response.json()

		if (data.response.status === 'ok') {
			return res.json({
				data: data.response.results,
				currentPage: data.response.currentPage,
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
	if (!req.query.id) {
		res.type('text/plain')
		res.status(404)
		return res.send('404 - Not Found')
	}

	const url = generateURL(req.query.id, {
		'show-fields': 'all',
	})

	try {
		const response = await fetch(url)
		const data = await response.json()
		res.json(data)
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
