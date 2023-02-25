import { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { Buffer } from 'buffer';
import { CharacterSelectionBlock } from '../components/CharacterSelectionBlock';
import { StatBlock } from '../components/StatBlock';
import { BuffBlock } from '../components/BuffBlock';
import { FormulaBlock } from '../components/FormulaBlock';
import { CharacterData, CharactersStorage } from '../shared/interfaces';

const MainContainer = styled.div`
  width: 100vw;
	min-height: 100vh;
  background-color: #dadaf8;
`;

const BlocksContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
`;

const SelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
	align-items: center;
  justify-content: space-around;
`;

const CharacterHeaderContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	padding: 10px;
`;

const CharacterHeaderName = styled.span`
	font-weight: bold;
	font-size: 20px;
	margin-right: 50px;
`;

const BackupContainer = styled.div`
	width: 80%;
	padding: 12px;
`;

const CodeParagraph = styled.p`
	word-wrap: break-word;
`;

const WarningText = styled.p`
	color: red;
	font-weight: bold;
`;

const storageKey = 'dt-bt';

const Main = () => {
	const [ selectedCharacter, setSelectedCharacter ] = useState('');
	const [ characterStorageState, setCharacterStorageState ] = useState<CharactersStorage>({});
	const [ statPool, setStatPool ] = useState<Record<string,number>>({});
	const [ backupInput, setBackupInput ] = useState('');

	const backupCode = useMemo(() => {
		return Buffer.from(JSON.stringify(characterStorageState)).toString('base64');
	}, [ characterStorageState ]);

	const loadBackupCode = (code: string) => {
		try {
			const stringifiedData = Buffer.from(code, 'base64').toString('ascii');
			const backupData = JSON.parse(stringifiedData);

			updateCharactersStorage(backupData);
		} catch {
			alert('invalid code');
			return;
		}
	};

	const generateStatPool = () => {
		if (!selectedCharacter || !Object.keys(characterStorageState).length) {
			return;
		}

		const newStatPool: Record<string,number> = {};

		characterStorageState[selectedCharacter].stats.forEach((stat) => {
			newStatPool[stat.name] = stat.value;
		});

		characterStorageState[selectedCharacter].buffs.forEach((buff) => {
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
		const newCharacterStorageState = structuredClone(characterStorageState);
		newCharacterStorageState[selectedCharacter] = newValue;

		updateCharactersStorage(newCharacterStorageState);
	};

	const updateCharactersStorage = (newStorage: CharactersStorage) => {
		setCharacterStorageState(newStorage);
		localStorage.setItem(storageKey, JSON.stringify(newStorage));
	};

	const renderCharacterSelection = () => {
		return (
			<>
				<SelectionContainer>
					<CharacterSelectionBlock
						characterStorage={characterStorageState}
						updateCharactersStorage={updateCharactersStorage}
						setSelectedCharacter={setSelectedCharacter}
					/>
				</SelectionContainer>
				<BackupContainer>
					<p>To load backup, paste the backup code in the field below:</p>
					<WarningText>WARNING: this will overwrite your current data</WarningText>
					<form>
						<input value={backupInput} onChange={(event) => {setBackupInput(event.target.value);}}/>
						<button style={{ marginLeft: 10 }} onClick={(event) => {
							event.preventDefault();
							loadBackupCode(backupInput);
							setBackupInput('');
						}}>Load backup</button>
					</form>
					<p>To save backup, copy the code below and save it somewhere safe:</p>
					<CodeParagraph>{backupCode}</CodeParagraph>
				</BackupContainer>
			</>
		);
	};

	const renderCharacterBlocks = () => {
		if (!Object.keys(characterStorageState).length) {
			return null;
		}

		return (
			<>
				<CharacterHeaderContainer>
					<p>Selected character: <CharacterHeaderName>{selectedCharacter}</CharacterHeaderName></p>
					<button onClick={() => {setSelectedCharacter('');}}>Select another character</button>
				</CharacterHeaderContainer>
				<BlocksContainer>
					<StatBlock
						characterData={characterStorageState[selectedCharacter]}
						updateCharacterData={updateCharacterData}
					/>
					<BuffBlock
						characterData={characterStorageState[selectedCharacter]}
						updateCharacterData={updateCharacterData}
					/>
					<FormulaBlock
						statPool={statPool}
						characterData={characterStorageState[selectedCharacter]}
						updateCharacterData={updateCharacterData}
					/>
				</BlocksContainer>
			</>
		);
	};

	useEffect(() => {
		const data = localStorage.getItem(storageKey);

		if (data) {
			setCharacterStorageState(JSON.parse(data));
		}
	}, []);

	useEffect(() => {
		generateStatPool();
	}, [ characterStorageState ]);

	return (
		<MainContainer>
			{selectedCharacter ? renderCharacterBlocks() : renderCharacterSelection()}
		</MainContainer>
	);
};

export { Main };
