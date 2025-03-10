import React from 'react';
import { YouTubeVideo, ChannelStats } from '@/lib/types/youtube';

interface Props {
	theme?: 'dark' | 'light';
	initialVideos?: YouTubeVideo[];
	initialChannelStats?: ChannelStats;
}

export default function YouTubePlaylist({
	theme = 'light',
	initialVideos = [],
	initialChannelStats,
}: Props) {
	if (!initialVideos.length || !initialChannelStats) {
		return null;
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				padding: '2rem 0',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					width: '320px',
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						width: '100%',
					}}
				>
					<img
						src={initialChannelStats.channelThumbnail}
						alt={initialChannelStats.channelName}
						style={{ height: '4rem', width: '4rem', borderRadius: '50%' }}
					/>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							padding: '1rem',
							alignItems: 'center',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<h6 style={{ fontSize: '14px', textAlign: 'center' }}>
							{initialChannelStats.channelHandle}
						</h6>
						<p style={{ fontSize: '12px' }}>
							{initialChannelStats.subscriberCount} subscribers
						</p>
						<p style={{ fontSize: '12px' }}>{initialChannelStats.viewCount} views</p>
					</div>
				</div>
			</div>

			<div style={{ width: '320px' }}>
				{initialVideos.map((video) => (
					<a
						href={`https://www.youtube.com/watch?v=${video.id}`}
						key={video.id}
						target="_blank"
						rel="noopener noreferrer"
						style={{ textDecoration: 'none', color: 'inherit' }}
					>
						<div style={{ marginBottom: '2rem' }}>
							<div style={{ position: 'relative' }}>
								<div
									style={{
										width: '100%',
										position: 'relative',
										...(video.isShort
											? {
													paddingTop: '177.77%', // 9:16 aspect ratio for shorts
													maxWidth: '180px',
													margin: '0 auto',
											  }
											: {
													paddingTop: '56.25%', // 16:9 aspect ratio for regular videos
											  }),
									}}
								>
									<img
										src={video.thumbnail}
										alt={video.title}
										style={{
											position: 'absolute',
											top: 0,
											left: 0,
											width: '100%',
											height: '100%',
											objectFit: 'cover',
											borderRadius: '0.5rem',
										}}
									/>
									<div
										style={{
											position: 'absolute',
											bottom: '8px',
											right: '8px',
											background: 'rgba(0, 0, 0, 0.8)',
											color: 'white',
											padding: '2px 4px',
											borderRadius: '4px',
											fontSize: '12px',
										}}
									>
										{video.duration}
									</div>
								</div>
							</div>
							<div style={{ width: '100%' }}>
								<h6
									style={{
										fontSize: '14px',
										lineHeight: '1.5',
										margin: '0.5rem 0',
									}}
								>
									{video.title}
								</h6>
								<p
									style={{
										fontSize: '12px',
										margin: '0.25rem 0',
									}}
								>
									{video.viewCount} views
								</p>
								<p
									style={{
										fontSize: '12px',
										margin: '0.5rem 0',
										whiteSpace: 'pre-wrap',
										wordWrap: 'break-word',
									}}
								>
									{video.description}
								</p>
							</div>
						</div>
					</a>
				))}
			</div>
		</div>
	);
}
