import styled from 'styled-components';
import { CharacterData } from '../shared/interfaces';
import { HorizontalLine } from '../components/HorizontalLine';
import { useState } from 'react';

interface BuffBlockProps {
  characterData: CharacterData;
  updateCharacterData: (newValue: CharacterData) => void;
}

const BuffBlockContainer = styled.div`
  border: solid 1px black;
  padding: 12px;
  margin: 8px;
  width: 30%;
`;

const BuffBlockTitle = styled.h1`
  font-weight: normal;
`;

const BuffContainer = styled.div`
  display: flex;
  width: 95%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 8px;
  background-color: #b2b2f7;
  padding: 8px;
`;

const NewBuffContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 8px;
`;

const NewBuffInput = styled.input`
  width: 40px;
  text-align: center;
  height: 20px;
  margin: 0 60px 0 20px;
`;

const NewStatInput = styled.input`
  width: 40px;
  text-align: center;
  height: 20px;
  margin: 0;
`;

const BuffName = styled.p`
  width: 20%;
  margin: 0 0 0 20px;
`;

const BuffStat = styled.p`
  margin: 0 20px 0 0;
`;

const BuffCheckbox = styled.input`
  margin: 2px 0 0 0;
  padding: 0;
`;

const BuffStatsContainer = styled.div`
  width: 40%;
`;

const BuffStatsInput = styled.input`
  width: 20px;
  text-align: center;
  height: 16px;
`;

const BuffRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width: 65%;
`;

const BuffBlock: React.FC<BuffBlockProps> = ({ characterData, updateCharacterData }) => {
	const [ newBuffName, setNewBuffName ] = useState('');
	const [ newBuffStat, setNewBuffStat ] = useState<Record<string, string>>({});

	const addNewBuff = (name: string) => {
		if (!name) {
			return;
		}

		if (name.length > 32) {
			alert('name is too long');
			return;
		}

		const buffExists = characterData.buffs.find((buff) => buff.name === name);

		if (buffExists) {
			alert('buff already exists');
			return;
		}

		const newBuffs = [ ...characterData.buffs, { name, enabled: false, stats: {} } ];

		updateCharacterData({
			...characterData,
			buffs: newBuffs,
		});
	};

	const removeBuff = (name: string) => {
		const newBuffs = [ ...characterData.buffs ].filter((buff) => buff.name !== name);

		updateCharacterData({
			...characterData,
			buffs: newBuffs,
		});
	};

	const onCheckboxChange = (name: string, checked: boolean) => {
		const buffsCopy = [ ...characterData.buffs ];

		buffsCopy.forEach((buff) => {
			if (buff.name === name) {
				buff.enabled = checked;
			}
		});

		console.log(buffsCopy);

		updateCharacterData({
			...characterData,
			buffs: buffsCopy,
		});
	};

	const onBuffStatChange = (name: string, stat: string, value: string) => {
		const numberValue = parseInt(value || '0');

		if (Number.isNaN(numberValue)) {
			return;
		}

		const buffsCopy = [ ...characterData.buffs ];

		buffsCopy.forEach((buff) => {
			if (buff.name === name) {
				buff.stats[stat] = numberValue;
			}
		});

		updateCharacterData({
			...characterData,
			buffs: buffsCopy,
		});
	};

	const onNewStatChange = (buffName: string, statName: string) => {
		const newNewBuffStat = structuredClone(newBuffStat);

		if (!statName) {
			delete newNewBuffStat[buffName];
			setNewBuffStat(newNewBuffStat);
			return;
		}

		newNewBuffStat[buffName] = statName;
		setNewBuffStat(newNewBuffStat);
	};

	const addNewBuffStat = (buffName: string) => {
		const buffsCopy = [ ...characterData.buffs ];

		buffsCopy.forEach((buff) => {
			if (buff.name === buffName) {
				const newStat = newBuffStat[buffName];
				buff.stats[newStat] = 0;
			}
		});

		updateCharacterData({
			...characterData,
			buffs: buffsCopy
		});
	};

	return (
		<BuffBlockContainer>
			<BuffBlockTitle>Buffs</BuffBlockTitle>
			<NewBuffContainer>
				<p>Add new buff: </p>
				<NewBuffInput onChange={(event) => { setNewBuffName(event.target.value); }}/>
				<button onClick={() => {addNewBuff(newBuffName);}}>add</button>
			</NewBuffContainer>
			<HorizontalLine />
			{characterData.buffs.map((buff) => (
				<BuffContainer key={buff.name}>
					<BuffCheckbox type="checkbox" checked={buff.enabled} onChange={(event) => {onCheckboxChange(buff.name, event.target.checked);}}/>
					<BuffName>{buff.name}</BuffName>
					<BuffStatsContainer>
						{Object.keys(buff.stats).map((stat) => (
							<BuffRow key={stat}>
								<BuffStat >{stat}: </BuffStat>
								<BuffStatsInput
									onChange={(event) => {onBuffStatChange(buff.name, stat, event.target.value);}}
									defaultValue={buff.stats[stat]}
								/>
							</BuffRow>
						))}
						<BuffRow>
							<NewStatInput onChange={(event) => {onNewStatChange(buff.name, event.target.value);}}/>
							<button onClick={() => {addNewBuffStat(buff.name);}}>add stat</button>
						</BuffRow>
					</BuffStatsContainer>
					<button onClick={() => {removeBuff(buff.name);}}>Remove buff</button>
				</BuffContainer>
			))}
		</BuffBlockContainer>
	);
};

export { BuffBlock };