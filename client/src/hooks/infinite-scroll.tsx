import { useEffect, useCallback } from 'react'

export const useInfiniteScroll = (scrollRef: any, loadmore: () => void) => {
	const scrollObserver = useCallback(
		node => {
			new IntersectionObserver(entries => {
				entries.forEach(en => {
					if (en.intersectionRatio > 0) {
						loadmore()
					}
				})
			}).observe(node)
		},
		[loadmore]
	)
	useEffect(() => {
		if (scrollRef.current) {
			scrollObserver(scrollRef.current)
		}
	}, [scrollObserver, scrollRef])
}
