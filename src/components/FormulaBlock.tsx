import styled from 'styled-components';
import { CharacterData } from '../shared/interfaces';

interface FormulaBlockProps {
  characterData: CharacterData;
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

const FormulaBlockText = styled.p``;

const FormulaBlock: React.FC<FormulaBlockProps> = () => {
	return (
		<FormulaBlockContainer>
			<FormulaBlockTitle>Formulas</FormulaBlockTitle>
			<FormulaBlockText>some Formulas</FormulaBlockText>
		</FormulaBlockContainer>
	);
};

export { FormulaBlock };
