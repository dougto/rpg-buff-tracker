import { useState } from 'react';
import styled from 'styled-components';
import { CharacterData, FormulaInterface } from '../shared/interfaces';
import { HorizontalLine } from '../components/HorizontalLine';
import { CollapseBox } from '../components/CollapseBox';

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
  width: 92%;
  margin-bottom: 8px;
  background-color: #b2b2f7;
  padding: 0 8px 0 20px;
`;

const FormulaRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
	width: 100%;
`;

const FormulaName = styled.p`
  margin: 0;
`;

const FormulaExpression = styled.input`
  text-align: center;
  height: 16px;
  margin-top: 12px;
	width: 65%;
  background-color: #afe4ff;
`;

const RemoveButton = styled.button`
	margin-top: 12px;
`;

const ResultNumber = styled.span`
  color: #019401;
  font-weight: bold;
  font-size: 18px;
`;

const CollapseBoxContainer = styled.div`
	margin: 8px 8px 12px 8px;
`;

const FormulaBlock: React.FC<FormulaBlockProps> = ({ statPool, characterData, updateCharacterData }) => {
	const [ newFormulaName, setNewFormulaName ] = useState('');

	const addNewFormula = (name: string) => {
		const newFormulas = [ ...characterData.formulas, { name, formula: '' } ];

		updateCharacterData({
			...characterData,
			formulas: newFormulas,
		});
	};

	const editFormula = (formulaName: string, value: string) => {
		const isCyclicDependency = characterData.formulas.some((formula) => {
			if (formula.formula.includes(formulaName) && value.includes(formula.name)) {
				return true;
			}
			return false;
		});

		if (isCyclicDependency) {
			alert('cyclic dependencies are not allowed');
			return;
		}

		const formulasCopy: Array<FormulaInterface> = structuredClone(characterData.formulas);

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
				<CollapseBoxContainer key={formula.name}>
					<CollapseBox
						CollapsedComponent={(
							<FormulaContainer>
								<FormulaRow>
									<FormulaName>{formula.name}</FormulaName>
									<FormulaName>result: <ResultNumber>{String(statPool[formula.name])}</ResultNumber></FormulaName>
								</FormulaRow>
							</FormulaContainer>
						)}
						NotCollapsedComponent={(
							<FormulaContainer>
								<FormulaRow>
									<FormulaName>{formula.name}</FormulaName>
									<FormulaName>result: <ResultNumber>{String(statPool[formula.name])}</ResultNumber></FormulaName>
								</FormulaRow>
								<FormulaRow>
									<FormulaExpression
										onChange={(event) => {editFormula(formula.name, event.target.value.trim());}}
										defaultValue={formula.formula}
									/>
									<RemoveButton tabIndex={-1} onClick={() => {removeFormula(formula.name);}}>Remove</RemoveButton>
								</FormulaRow>
							</FormulaContainer>
						)}
					/>
				</CollapseBoxContainer>
			))}
		</FormulaBlockContainer>
	);
};

export { FormulaBlock };
