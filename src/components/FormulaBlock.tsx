import { useState } from 'react';
import styled from 'styled-components';
import { CharacterData } from '../shared/interfaces';
import { HorizontalLine } from '../components/HorizontalLine';

interface FormulaBlockProps {
  characterData: CharacterData;
  statPool: Record<string,number>;
  updateCharacterData: (newValue: CharacterData) => void;
}

const FormulaBlockContainer = styled.div`
  border: solid 1px black;
  padding: 12px;
  margin: 8px;
  width: 30%;
`;

const FormulaBlockTitle = styled.h1`
  font-weight: normal;
`;

const NewFormulaContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 8px;
`;

const NewFormulaInput = styled.input`
  width: 80px;
  text-align: center;
  height: 20px;
  margin: 0 60px 0 20px;
`;

const FormulaBlock: React.FC<FormulaBlockProps> = ({ statPool ,characterData, updateCharacterData }) => {
	const [ newFormulaName, setNewFormulaName ] = useState('');

	// const validateFormula = (formula: string) => {
	// 	return !formula.match(/\D\D|\D$|^\D|^0/g);
	// };

	const evalFormula = (formula: string) => {
		const statNames = Object.keys(statPool);

		let expression = formula;

		statNames.forEach((stat) => {
			if (formula.includes(stat)) {
				expression = expression.replaceAll(stat, String(statPool[stat]));
			}
		});

		return eval(expression);
	};

	const addNewFormula = (name: string) => {
		const newFormulas = [ ...characterData.formulas, { name, formula: '' } ];

		updateCharacterData({
			...characterData,
			formulas: newFormulas,
		});
	};

	return (
		<FormulaBlockContainer>
			<FormulaBlockTitle>Formulas</FormulaBlockTitle>
			<NewFormulaContainer>
				<p>Add new formula: </p>
				<NewFormulaInput onChange={(event) => { setNewFormulaName(event.target.value); }}/>
				<button onClick={() => {addNewFormula(newFormulaName);}}>add</button>
			</NewFormulaContainer>
			<HorizontalLine/>
			{characterData.formulas.map((formula) => (
				<div key={formula.name}>
					<p >{formula.name}: {formula.formula}</p>
					<p >result: {evalFormula(formula.formula)}</p>
				</div>
			))}
		</FormulaBlockContainer>
	);
};

export { FormulaBlock };
