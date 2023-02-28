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

const NewStatContainer = styled.form`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const StatContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
	margin: 0 24px 4px 24px;
`;

const StatName = styled.p`
	margin: 0;
`;

const NewStatInput = styled.input`
  width: 80px;
  text-align: center;
  height: 20px;
  margin: 0 60px 0 20px;
`;

const StatValue = styled.input`
  width: 40px;
  text-align: center;
  height: 20px;
  background-color: #afe4ff;
`;

const RemoveButton = styled.button`
  color: red;
  margin: 0 0 0 8px;
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

		const formulaExists = characterData.formulas.find((formula) => formula.name === name);

		if (formulaExists) {
			alert('there is already a formula using this name');
			return;
		}

		const statExists = characterData.stats.find((stat) => stat.name === name);

		if (statExists) {
			alert('this stat already exists');
			return;
		}

		const newStats = [ ...characterData.stats, { name, value: 0 } ];

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

		const newStats = [ ...characterData.stats ];
		newStats.forEach((stat, index) => {
			if (stat.name === name) {
				newStats[index] = newStat;
			}
		});

		const newCharacterData: CharacterData = {
			...characterData,
			stats: newStats,
		};

		updateCharacterData(newCharacterData);
	};

	return (
		<StatBlockContainer>
			<StatBlockTitle>Stats</StatBlockTitle>
			<NewStatContainer>
				<p>Add new stat: </p>
				<NewStatInput value={newStatName} onChange={(event) => { setNewStatName(event.target.value.trim()); }}/>
				<button onClick={(event) => {
					event.preventDefault();
					addStat(newStatName);
					setNewStatName('');
				}}>add</button>
			</NewStatContainer>
			<HorizontalLine/>
			{characterData.stats.map((stat) => (
				<StatContainer key={stat.name}>
					<StatName >{stat.name}:</StatName>
					<div>
						<StatValue onChange={(event) => { editStat(stat.name, event.target.value.trim()); }} defaultValue={stat.value}/>
						<RemoveButton tabIndex={-1} onClick={() => {removeStat(stat.name);}}>X</RemoveButton>
					</div>
				</StatContainer>
			))}
		</StatBlockContainer>
	);
};

export { StatBlock };
