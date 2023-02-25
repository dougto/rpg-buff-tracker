import { useState } from 'react';
import styled from 'styled-components';
import { CharacterData, CharactersStorage } from '../shared/interfaces';

interface CharacterSelectionBlockProps {
  characterStorage: CharactersStorage;
  updateCharactersStorage: (newStorage: CharactersStorage) => void;
  setSelectedCharacter: (name: string) => void;
}

const CharacterSelectionBox = styled.div`
  display: flex;
	border: solid 1px black;
	margin: 60px;
  width: 40%;
  height: 80vh;
	flex-direction: column;
	align-items: center;
  justify-content: flex-start;
`;

const CharacterBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
	height: 60px;
  width: 80%;
  margin-top: 20px;
  padding: 0 12px 0;
  border: solid 1px black;
`;

const CharacterName = styled.p`
  font-size: 20px;
  font-weight: bold;
`;

const NewCharacterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 80%;
  margin-top: 30px;
`;

const NewCharacterInput = styled.input`
  width: 80%;
  text-align: center;
  height: 20px;
`;

const RemoveCharacterButton = styled.button`
  color: red;
  margin-left: 20px;
`;

const startingCharacterData: CharacterData = {
	stats: [],
	buffs: [],
	formulas: [],
};

const CharacterSelectionBlock: React.FC<CharacterSelectionBlockProps> = ({
	characterStorage,
	updateCharactersStorage,
	setSelectedCharacter,
}) => {
	const [ newCharacterName, setNewCharacterName ] = useState('');

	const addCharacter = (name: string) => {
		if (Object.keys(characterStorage).includes(name)) {
			alert('character already exists');
			return;
		}

		const newCharacterStorage = structuredClone(characterStorage);
		newCharacterStorage[name] = structuredClone(startingCharacterData);

		updateCharactersStorage(newCharacterStorage);
	};

	const removeCharacter = (name: string) => {
		const newCharacterStorage = structuredClone(characterStorage);
		delete newCharacterStorage[name];

		updateCharactersStorage(newCharacterStorage);
	};

	const renderCharacterList = () => {
		if (!Object.keys(characterStorage).length) {
			return null;
		}

		const characterNames = Object.keys(characterStorage);

		return characterNames.map((name) => (
			<CharacterBlock key={name}>
				<CharacterName>{name}</CharacterName>
				<div>
					<button onClick={() => {setSelectedCharacter(name);}}>Select</button>
					<RemoveCharacterButton onDoubleClick={() => {removeCharacter(name);}}>Double click to remove</RemoveCharacterButton>
				</div>
			</CharacterBlock>
		));
	};

	return (
		<CharacterSelectionBox>
			{renderCharacterList()}
			<NewCharacterContainer>
				<NewCharacterInput onChange={(event) => {setNewCharacterName(event.target.value);}}/>
				<button onClick={() => {addCharacter(newCharacterName);}}>Add character</button>
			</NewCharacterContainer>
		</CharacterSelectionBox>
	);
};

export { CharacterSelectionBlock };
