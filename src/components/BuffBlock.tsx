import { useState } from 'react';
import styled from 'styled-components';
import { CharacterData } from '../shared/interfaces';
import { HorizontalLine } from '../components/HorizontalLine';
import { CollapseBox } from '../components/CollapseBox';

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
  flex-direction: column;
  padding: 8px;
	width: 100%;
`;

const BuffContainerHeader = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: flex-start;
`;

const BuffContainerRow = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-start;
	width: 100%;
`;

const NewBuffContainer = styled.form`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 8px;
`;

const NewBuffInput = styled.input`
  width: 80px;
  text-align: center;
  height: 20px;
  margin: 0 60px 0 20px;
`;

const NewStatInput = styled.input`
  width: 40px;
  text-align: center;
  height: 20px;
  margin: 0 10px 0 0;
`;

const BuffName = styled.p`
  width: 20%;
  margin: 0 0 0 20px;
`;

const BuffStat = styled.p`
	margin: 0;
`;

const BuffCheckbox = styled.input`
  margin: 2px 0 0 0;
  padding: 0;
`;

const BuffStatsContainer = styled.div`
  width: 100%;
	margin-top: 12px;
`;

const BuffStatsInput = styled.input`
  width: 30px;
  text-align: center;
  height: 16px;
  margin-right: 10px;
  background-color: #afe4ff;
`;

const BuffRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  margin-bottom: 4px;
`;

const RemoveStatButton = styled.button`
  color: red;
  margin: 0;
`;

const CollapseBoxContainer = styled.div`
	margin: 8px 8px 12px 8px;
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
		if (!newBuffStat[buffName]) {
			return;
		}

		const formulaExists = characterData.formulas.find((formula) => formula.name === newBuffStat[buffName]);

		if (formulaExists) {
			alert('there is already a formula using this name');
			return;
		}

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

	const removeBuffStat = (buffName: string, stat: string) => {
		const buffsCopy = [ ...characterData.buffs ];

		buffsCopy.forEach((buff) => {
			if (buff.name === buffName) {
				delete buff.stats[stat];
			}
		});

		updateCharacterData({
			...characterData,
			buffs: buffsCopy,
		});
	};

	return (
		<BuffBlockContainer>
			<BuffBlockTitle>Buffs</BuffBlockTitle>
			<NewBuffContainer>
				<p>Add new buff: </p>
				<NewBuffInput value={newBuffName} onChange={(event) => { setNewBuffName(event.target.value.trim()); }}/>
				<button onClick={(event) => {
					event.preventDefault();
					addNewBuff(newBuffName);
					setNewBuffName('');
				}}>add</button>
			</NewBuffContainer>
			<HorizontalLine />
			{characterData.buffs.map((buff) => (
				<CollapseBoxContainer key={buff.name}>
					<CollapseBox
						CollapsedComponent={(
							<BuffContainer>
								<BuffContainerHeader>
									<BuffCheckbox type="checkbox" checked={buff.enabled} onChange={(event) => {onCheckboxChange(buff.name, event.target.checked);}}/>
									<BuffName>{buff.name}</BuffName>
								</BuffContainerHeader>
							</BuffContainer>
						)}
						NotCollapsedComponent={(
							<BuffContainer >
								<BuffContainerRow>
									<BuffContainerHeader>
										<BuffCheckbox type="checkbox" checked={buff.enabled} onChange={(event) => {onCheckboxChange(buff.name, event.target.checked);}}/>
										<BuffName>{buff.name}</BuffName>
									</BuffContainerHeader>
									<button onClick={() => {removeBuff(buff.name);}}>Remove buff</button>
								</BuffContainerRow>
								<BuffContainerRow>
									<BuffStatsContainer>
										{Object.keys(buff.stats).map((stat) => (
											<BuffRow key={stat}>
												<BuffStat >{stat}: </BuffStat>
												<div>
													<BuffStatsInput
														onChange={(event) => {onBuffStatChange(buff.name, stat, event.target.value.trim());}}
														defaultValue={buff.stats[stat]}
													/>
													<RemoveStatButton tabIndex={-1} onClick={() => {removeBuffStat(buff.name, stat);}}>X</RemoveStatButton>
												</div>
											</BuffRow>
										))}
										<BuffRow>
											<form>
												<NewStatInput value={newBuffStat[buff.name]} onChange={(event) => {onNewStatChange(buff.name, event.target.value.trim());}}/>
												<button onClick={(event) => {
													event.preventDefault();
													addNewBuffStat(buff.name);
													onNewStatChange(buff.name, ' ');
												}}>add stat</button>
											</form>
										</BuffRow>
									</BuffStatsContainer>
								</BuffContainerRow>
							</BuffContainer>
						)}
					/>
				</CollapseBoxContainer>
			))}
		</BuffBlockContainer>
	);
};

export { BuffBlock };
