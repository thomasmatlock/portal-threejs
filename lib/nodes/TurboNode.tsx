import React, { memo, ReactNode } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { FiCloud } from 'react-icons/fi';

// Define strict typing for node data
export interface TurboNodeData {
	title: string;
	icon?: ReactNode;
	subline?: string;
}

// Create a named component for better debugging
const TurboNode = memo(({ data }: NodeProps<TurboNodeData>) => {
	const { title, icon, subline } = data;

	return (
		<>
			<div className="cloud gradient" role="presentation">
				<div>
					<FiCloud aria-hidden="true" />
				</div>
			</div>
			<div className="wrapper gradient">
				<div className="inner">
					<div className="body">
						{icon && (
							<div className="icon" role="img">
								{icon}
							</div>
						)}
						<div>
							<div className="title">{title}</div>
							{subline && <div className="subline">{subline}</div>}
						</div>
					</div>
					<Handle type="target" position={Position.Left} role="connection" />
					<Handle type="source" position={Position.Right} role="connection" />
				</div>
			</div>
		</>
	);
});

// Add display name for better debugging
TurboNode.displayName = 'TurboNode';

export default TurboNode;
