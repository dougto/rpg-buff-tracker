import { useState } from 'react';
import styled from 'styled-components';
import { StatBlock } from '../components/StatBlock';
import { BuffBlock } from '../components/BuffBlock';
import { FormulaBlock } from '../components/FormulaBlock';
import { CharacterData } from '../shared/interfaces';

const startingCharacterState: CharacterData = {
	stats: [
		{ name: 'str', value: 26 },
		{ name: 'dex', value: 14 },
		{ name: 'con', value: 18 },
		{ name: 'int', value: 5 },
		{ name: 'cha', value: 12 },
		{ name: 'wis', value: 13 },
		{ name: 'bba', value: 14 },
	],
	buffs: [
		{ name: 'rage', enabled: false, stats: { str: 6, con: 4, ac: -2 } },
		{ name: 'div_favor', enabled: false, stats: { ar_luck: 3, ad_luck: 3 } },
	],
	formulas: [
		{ name: 'axe', formula: 'bba+(str/2)+ar_luck' }
	],
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

const Main = () => {
	const [ characterData, setCharacterData ] = useState<CharacterData>(startingCharacterState);

	const updateCharacterData = (newValue: CharacterData) => {
		setCharacterData(structuredClone(newValue));
	};

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
					characterData={characterData}
					updateCharacterData={updateCharacterData}
				/>
			</BlocksContainer>
		</MainContainer>
	);
};

export { Main };