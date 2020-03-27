import React, { Fragment, useEffect, useRef, useReducer } from 'react'
import { useHistory } from 'react-router-dom'
import { useQueryParams, NumberParam, StringParam } from 'use-query-params'
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'

import { Card } from '../components/card'
import { PlaceholderShimmer } from '../components/placeholder-shimmer'
import { AlertError } from '../components/alert-error'
import { useInfiniteScroll } from '../hooks/infinite-scroll'
import { Post } from '../models'

type Response = {
	data: Post[]
	currentPage: number
	hasNextPage: boolean
}

type State = {
	response: Response
	loading: boolean
	isError: boolean
}

const initialResponse: Response = {
	data: [],
	currentPage: 0,
	hasNextPage: false,
}

const stateReducer = (state: State, action: any) => {
	switch (action.type) {
		case 'FETCHING':
			return {
				...state,
				loading: true,
				isError: false,
			}
		case 'FETCH_SUCCESS': {
			return {
				...state,
				loading: false,
				response: {
					...action.payload,
					data: [...state.response.data, ...action.payload.data],
				},
			}
		}

		case 'FETCH_FAILURE':
			return {
				...state,
				loading: false,
				isError: true,
			}
		case 'RESET':
			return {
				loading: false,
				isError: false,
				response: { ...initialResponse },
			}
		default:
			return state
	}
}

const Loading: React.FC = () => (
	<Fragment>
		{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val, index) => (
			<Grid item xs={12} sm={6} md={4} lg={3} key={index}>
				<PlaceholderShimmer />
			</Grid>
		))}
	</Fragment>
)

export const HomePage: React.FC = () => {
	const history = useHistory()
	const [query, setQuery] = useQueryParams({
		page: NumberParam,
		q: StringParam,
		orderBy: StringParam,
	})
	const [state, dispatch] = useReducer(stateReducer, {
		loading: true,
		response: { ...initialResponse },
		isError: false,
	})
	const bottomBoundaryRef = useRef(null)

	useInfiniteScroll(bottomBoundaryRef, () => {
		const { page = 1 } = query
		setQuery({ page: page + 1 }, 'pushIn')
	})

	useEffect(() => {
		let didCancel = false
		const { page = 1, q = '', orderBy = 'newest' } = query

		const fetchData = async () => {
			try {
				dispatch({ type: 'FETCHING' })
				const response = await fetch(
					`http://localhost:3000/search?q=${q}&page=${page}&orderBy=${orderBy}`
				)
				const result: Response = await response.json()
				if (!didCancel) {
					dispatch({ type: 'FETCH_SUCCESS', payload: result })
				}
			} catch (err) {
				console.error(err)
				dispatch({ type: 'FETCH_FAILURE' })
			}
		}
		fetchData()

		return () => {
			didCancel = true
		}
	}, [query])

	function handleChangeSearch(e: any) {
		dispatch({ type: 'RESET' })
		setQuery({ q: e.target.value }, 'push')
	}

	function handleChangeOrderBy(e: any) {
		dispatch({ type: 'RESET' })
		setQuery({ page: 1, orderBy: e.target.value }, 'pushIn')
	}

	const {
		loading,
		isError,
		response: { data, hasNextPage },
	} = state

	return (
		<Container style={{ paddingTop: 24 }}>
			{isError && <AlertError />}

			<Box mb={3} display="flex" justifyContent="space-between">
				<TextField
					type="search"
					value={query.q || ''}
					label="Search"
					onChange={handleChangeSearch}
					variant="filled"
					fullWidth
				/>

				<Select
					labelId="order by"
					value={query.orderBy || 'newest'}
					onChange={handleChangeOrderBy}
					style={{ marginLeft: 20 }}
				>
					<MenuItem value="newest">newest</MenuItem>
					<MenuItem value="oldest">oldest</MenuItem>
				</Select>
			</Box>

			{query.q?.trim() && (
				<Typography variant="h6" component="p" gutterBottom>
					Search results: {query.q}
				</Typography>
			)}

			<Grid container spacing={3}>
				{data.length > 0 &&
					data.map((item: any) => (
						<Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
							<Card
								data={item}
								onClick={() => {
									history.push(`/news?id=${item.id}`)
								}}
							/>
						</Grid>
					))}

				{!loading && data.length === 0 && (
					<Grid item xs={12}>
						<Typography variant="body1" color="textSecondary">
							No article
						</Typography>
					</Grid>
				)}

				{loading && <Loading />}
			</Grid>

			{!loading && hasNextPage && (
				<div
					id="page-bottom-boundary"
					style={{ border: '1px solid transparent' }}
					ref={bottomBoundaryRef}
				/>
			)}
		</Container>
	)
}
