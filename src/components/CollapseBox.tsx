import { useState } from 'react';
import styled from 'styled-components';

interface CollapseBoxProps {
  CollapsedComponent: React.ReactElement;
  NotCollapsedComponent: React.ReactElement;
}

const CollapseContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #b2b2f7;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 8px;
`;

const CollapsePressArea = styled.button`
  background-color: #8f8ff5;
  border: none;
  margin: 0;

  :hover {
    cursor: pointer;
  }
`;

const CollapseBox: React.FC<CollapseBoxProps> = ({ CollapsedComponent, NotCollapsedComponent }) => {
	const [ isCollapsed, setIsCollapsed ] = useState(true);

	const toggleCollapse = () => {
		setIsCollapsed(!isCollapsed);
	};

	return (
		<CollapseContainer>
			<ContentContainer>
				{isCollapsed ? (CollapsedComponent) : (NotCollapsedComponent)}
			</ContentContainer>
			<CollapsePressArea onClick={() => {toggleCollapse();}}>{isCollapsed ? 'open' : 'close'}</CollapsePressArea>
		</CollapseContainer>
	);
};

export { CollapseBox };
