import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { StatBlock } from '../components/StatBlock';
import { BuffBlock } from '../components/BuffBlock';
import { FormulaBlock } from '../components/FormulaBlock';
import { CharacterData } from '../shared/interfaces';

const startingCharacterState: CharacterData = {
	stats: [],
	buffs: [],
	formulas: [],
};

const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #dadaf8;
`;

const BlocksContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
`;

const storageKey = 'dt-bt';

const Main = () => {
	const [ characterData, setCharacterData ] = useState<CharacterData>(startingCharacterState);
	const [ statPool, setStatPool ] = useState<Record<string,number>>({});

	const generateStatPool = () => {
		const newStatPool: Record<string,number> = {};

		characterData.stats.forEach((stat) => {
			newStatPool[stat.name] = stat.value;
		});

		characterData.buffs.forEach((buff) => {
			Object.keys(buff.stats).forEach((buffStat) => {
				const previousValue = newStatPool[buffStat] || 0;

				if (buff.enabled){
					newStatPool[buffStat] = previousValue + buff.stats[buffStat];
					return;
				}

				newStatPool[buffStat] = previousValue;
			});
		});

		setStatPool(newStatPool);
	};

	const updateCharacterData = (newValue: CharacterData) => {
		setCharacterData(structuredClone(newValue));
		localStorage.setItem(storageKey, JSON.stringify(newValue));
	};

	useEffect(() => {
		const data = localStorage.getItem(storageKey);

		if (data) {
			setCharacterData(JSON.parse(data));
		}
	}, []);

	useEffect(() => {
		generateStatPool();
	}, [ characterData ]);

	return (
		<MainContainer>
			<BlocksContainer>
				<StatBlock
					characterData={characterData}
					updateCharacterData={updateCharacterData}
				/>
				<BuffBlock
					characterData={characterData}
					updateCharacterData={updateCharacterData}
				/>
				<FormulaBlock
					statPool={statPool}
					characterData={characterData}
					updateCharacterData={updateCharacterData}
				/>
			</BlocksContainer>
		</MainContainer>
	);
};

export { Main };
