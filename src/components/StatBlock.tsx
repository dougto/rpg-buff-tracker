import { useState } from 'react';
import styled from 'styled-components';
import { CharacterData } from '../shared/interfaces';
import { HorizontalLine } from '../components/HorizontalLine';

interface StatBlockProps {
  characterData: CharacterData;
  updateCharacterData: (newValue: CharacterData) => void;
}

const StatBlockContainer = styled.div`
  border: solid 1px black;
  padding: 12px;
  margin: 8px;
  width: 30%;
`;

const StatBlockTitle = styled.h1`
  font-weight: normal;
`;

const StatContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const StatName = styled.p`
  width: 20%;
`;

const StatValue = styled.input`
  width: 40px;
  text-align: center;
  height: 20px;
  margin-right: 60px;
`;

const RemoveButton = styled.button`
  color: red;
  margin: 0;
`;

const StatBlock: React.FC<StatBlockProps> = ({ characterData, updateCharacterData }) => {
	const [ newStatName, setNewStatName ] = useState('');

	const removeStat = (name: string) => {
		const newStats = [ ...characterData.stats ].filter((stat) => stat.name !== name);

		const newCharacterData: CharacterData = {
			...characterData,
			stats: newStats,
		};

		updateCharacterData(newCharacterData);
	};

	const addStat = (name: string) => {
		if (!name) {
			return;
		}

		if (name.length > 32) {
			alert('name is too long');
			return;
		}

		const statExists = characterData.stats.find((stat) => stat.name === name);

		if (statExists) {
			alert('this stat already exists');
			return;
		}

		const newStats = [ { name, value: 0 }, ...characterData.stats ];

		const newCharacterData: CharacterData = {
			...characterData,
			stats: newStats,
		};

		updateCharacterData(newCharacterData);
	};

	const editStat = (name: string, value: string) => {
		const numberValue = parseInt(value || '0');

		if (Number.isNaN(numberValue)) {
			return;
		}

		const newStat = { name, value: numberValue };

		const newStats = [ newStat, ...characterData.stats.filter((stat) => stat.name !== name) ];

		const newCharacterData: CharacterData = {
			...characterData,
			stats: newStats,
		};

		updateCharacterData(newCharacterData);
	};

	return (
		<StatBlockContainer>
			<StatBlockTitle>Stats</StatBlockTitle>
			<StatContainer>
				<StatName>Add new stat: </StatName>
				<StatValue onChange={(event) => { setNewStatName(event.target.value); }}/>
				<button onClick={() => {addStat(newStatName);}}>add</button>
			</StatContainer>
			<HorizontalLine/>
			{characterData.stats.map((stat) => (
				<StatContainer key={stat.name}>
					<StatName >{stat.name}:</StatName>
					<StatValue onChange={(event) => { editStat(stat.name, event.target.value); }} defaultValue={stat.value}/>
					<RemoveButton onClick={() => {removeStat(stat.name);}}>X</RemoveButton>
				</StatContainer>
			))}
		</StatBlockContainer>
	);
};

export { StatBlock };
