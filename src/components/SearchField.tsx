import React, { useState, useRef } from 'react';
import styled from 'styled-components';

interface SearchFieldProps {
  suggestionPool: Array<string>;
  defaultValue: string;
  updateFormula: (formula: string) => void;
}

const SearchFieldContainer = styled.div`
  position: relative;
  margin: 0;
`;

const SearchFieldInput = styled.input`
  text-align: center;
  height: 16px;
  background-color: #afe4ff;
  width: 100%;
  margin: 0;
`;

const SuggestionsBox = styled.div`
  position: absolute;
  top: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #eee;
  max-height: 150px;
  overflow: scroll;
`;

const SelectedSuggestionText = styled.div`
  color: #fff;
  background-color: blue;
`;

const SearchField: React.FC<SearchFieldProps> = ({ suggestionPool, updateFormula, defaultValue }) => {
	const [ isInputFocused, setIsInputFocused ] = useState(false);
	const [ showSuggestions, setShowSuggestions ] = useState(false);
	const [ selectedSuggestionIndex, setSelectedSuggestionIndex ] = useState(0);
	const [ inputValue, setInputValue ] = useState('');

	const InputRef = useRef<HTMLInputElement>(null);

	const handleInputChange = (value: string) => {
		const splittedArray = value.split(/\+|\-|\/|\*|\(|\)/g);
		const lastName = splittedArray[splittedArray.length-1];

		setInputValue(lastName);
		setSelectedSuggestionIndex(0);

		if (value.length > 0) {
			setShowSuggestions(true);
		} else {
			setShowSuggestions(false);
		}

		if (InputRef.current) {
			updateFormula(InputRef.current.value);
		}
	};

	const renderSuggestionBox = () => {
		if (showSuggestions) {
			return (
				<SuggestionsBox>
					{suggestionPool.filter((suggestion) => (
						suggestion.includes(inputValue)
					)).map((suggestion, index) => {
						if (index === selectedSuggestionIndex) {
							return (<SelectedSuggestionText key={suggestion}>{suggestion}</SelectedSuggestionText>);
						}

						return (<div key={suggestion}>{suggestion}</div>);
					})}
				</SuggestionsBox>
			);
		}

		return null;
	};

	const handleKeyEvent = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (!isInputFocused) {
			return;
		}

		if (event.key === 'ArrowRight') {
			setShowSuggestions(false);
			setSelectedSuggestionIndex(0);
		} else if (event.key === 'ArrowLeft') {
			setShowSuggestions(false);
			setSelectedSuggestionIndex(0);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (selectedSuggestionIndex > 0) {
				setSelectedSuggestionIndex((previousValue) => previousValue - 1);
			}
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();

			const filteredPool = suggestionPool.filter((suggestion) => (
				suggestion.includes(inputValue)
			));

			if (selectedSuggestionIndex < filteredPool.length - 1) {
				setSelectedSuggestionIndex((previousValue) => previousValue + 1);
			}
		} else if (event.key === 'Enter') {
			const filteredPool = suggestionPool.filter((suggestion) => (
				suggestion.includes(inputValue)
			));
			const selectedName = filteredPool[selectedSuggestionIndex];

			setShowSuggestions(false);
			setSelectedSuggestionIndex(0);

			if (InputRef.current) {
				const splicedInputValue = inputValue ? InputRef.current.value.split('').slice(0, -inputValue.length).join('') : InputRef.current.value;
				const formula = splicedInputValue + selectedName;

				InputRef.current.value = formula;
				updateFormula(formula);
			}
		}
	};

	return (
		<SearchFieldContainer>
			{renderSuggestionBox()}
			<SearchFieldInput
				ref={InputRef}
				onFocus={(event) => {
					setIsInputFocused(event.currentTarget === document.activeElement);
				}}
				onBlur={() => {
					setShowSuggestions(false);
					setSelectedSuggestionIndex(0);
					setIsInputFocused(false);
				}}
				onChange={(event) => {handleInputChange(event.target.value);}}
				onKeyDown={(event) => {handleKeyEvent(event);}}
				defaultValue={defaultValue}
			/>
		</SearchFieldContainer>
	);
};

export { SearchField };
