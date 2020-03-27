import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'

import { HomePage } from './pages/home'
import { DetailPage } from './pages/detail'
import { NotFoundPage } from './pages/not-found'

function ScrollToTop() {
	const { pathname } = useLocation()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [pathname])

	return null
}

const App: React.FC = () => {
	return (
		<Router>
			<QueryParamProvider ReactRouterRoute={Route}>
				<ScrollToTop />
				<Switch>
					<Route exact path="/">
						<HomePage />
					</Route>

					<Route path="/news">
						<DetailPage />
					</Route>

					<Route path="*">
						<NotFoundPage />
					</Route>
				</Switch>
			</QueryParamProvider>
		</Router>
	)
}

export default App
