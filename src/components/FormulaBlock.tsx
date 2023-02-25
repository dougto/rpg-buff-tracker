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

const NewFormulaContainer = styled.form`
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

const FormulaContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  margin-bottom: 8px;
  background-color: #b2b2f7;
  padding: 8px 8px 8px 20px;
`;

const FormulaRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const FormulaName = styled.p`
  margin: 0;
`;

const FormulaExpression = styled.input`
  text-align: center;
  height: 16px;
  margin-right: 10px;
  background-color: #afe4ff;
`;

const ResultNumber = styled.span`
  color: #019401;
  font-weight: bold;
  font-size: 18px;
`;

const FormulaBlock: React.FC<FormulaBlockProps> = ({ statPool ,characterData, updateCharacterData }) => {
	const [ newFormulaName, setNewFormulaName ] = useState('');

	const evalFormula = (formula: string) => {
		if (!formula) {
			return 0;
		}

		const statNames = Object.keys(statPool);

		if (statNames.length === 0) {
			return 0;
		}

		let expression = formula;

		statNames.sort((prev, next) => {
			if (prev.length > next.length) {
				return -1;
			}
			return 1;
		}).forEach((stat) => {
			if (formula.includes(stat)) {
				expression = expression.replaceAll(stat, String(statPool[stat]));
			}
		});

		expression = expression.replaceAll(' ', '');

		try {
			const result = Math.floor(eval(expression));

			return result;
		} catch (error) {
			return 0;
		}
	};

	const addNewFormula = (name: string) => {
		const newFormulas = [ ...characterData.formulas, { name, formula: '' } ];

		updateCharacterData({
			...characterData,
			formulas: newFormulas,
		});
	};

	const editFormula = (formulaName: string, value: string) => {
		const formulasCopy = [ ...characterData.formulas ];

		formulasCopy.forEach((formula) => {
			if (formula.name === formulaName) {
				formula.formula = value;
			}
		});

		updateCharacterData({
			...characterData,
			formulas: formulasCopy,
		});
	};

	const removeFormula = (name: string) => {
		const newFormulas = [ ...characterData.formulas ].filter((formula) => formula.name !== name);

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
				<NewFormulaInput value={newFormulaName} onChange={(event) => { setNewFormulaName(event.target.value.trim()); }}/>
				<button onClick={(event) => {
					event.preventDefault();
					addNewFormula(newFormulaName);
					setNewFormulaName('');
				}}>add</button>
			</NewFormulaContainer>
			<HorizontalLine/>
			{characterData.formulas.map((formula) => (
				<FormulaContainer key={formula.name}>
					<FormulaRow>
						<FormulaName>{formula.name}</FormulaName>
						<FormulaExpression
							onChange={(event) => {editFormula(formula.name, event.target.value.trim());}}
							defaultValue={formula.formula}
						/>
						<button tabIndex={-1} onClick={() => {removeFormula(formula.name);}}>Remove</button>
					</FormulaRow>
					<p>result: <ResultNumber>{evalFormula(formula.formula)}</ResultNumber></p>
				</FormulaContainer>
			))}
		</FormulaBlockContainer>
	);
};

export { FormulaBlock };
