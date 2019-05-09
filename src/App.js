import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import ClassTodo from './ClassTodo';

function App() {
    const [selectedOption, setSelectedOption] = useState('');
    const [showMain, setShowMain] = useState(true);

    const handleClick = (event) => {
        setSelectedOption(event.target.value);
        setShowMain(false);
    };
    return (
        <div className="App">
            {showMain ? <div>
                    <h3>The Github Profile TODO List</h3>
                    <button value="1" className="typeButton" onClick={handleClick}>Class Based TODO</button>
                    <button value="2" className="typeButton" onClick={handleClick}>Function Based TODO</button>
                </div>
                : <div></div>}
            {selectedOption == '1' ? <ClassTodo/> : selectedOption == '2' ? <div>Saravanan</div> : <></>}
        </div>
    );
}

export default App;
