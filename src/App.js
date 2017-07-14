import React, { Component } from 'react';
import axios from 'axios'
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      characters: {}
      // "maleAverage" : 89,
      // "femaleAverage" : 100,
      // "unknownAverage" : 50
    } 
  }

  componentWillMount(){
    axios.get('http://localhost:8080/')
      .then((response) => {
        this.setState({characters : response.data.characters})
        console.log(this.state)
        this.calculateAge();
    })
      .catch(function (error) {
        console.log(error);
      });       
  }

  calculateYear(myString){
    let tempArray = myString.split(" ")
    let year = 0;
    for (let i=0; i<tempArray.length; i++){
      if ( !isNaN(tempArray[i])){
        year = tempArray[i];
        break;
      }
    }
    if (year === 0){
      return undefined;
    }
    return year;
  }

  calculateAge(){
    this.state.characters.forEach((character) => {
      let birth = this.calculateYear(character.born)
      let death = this.calculateYear(character.died)
      if (birth && death){
        character.age = death - birth;
      }
    })
    // console.log(this.state);
    this.setState({
      state: this.state
    })
  }

  render() {

    let characters = this.state.characters;
    let maleSum = 0;
    let maleCount = 0;
    let femaleSum = 0;
    let femaleCount = 0;
    let unknownSum = 0;
    let unknownCount = 0;

    for (let i = 0; i < characters.length; i++){
      console.log(this.state.characters[i]);
      if (characters[i].gender === "Male" && characters[i].age) {
        maleSum += characters[i].age;
        maleCount++;
      } else if (characters[i].gender === "Female" && characters[i].age) {
        femaleSum += characters[i].age;
        femaleCount++;
      } 
    }

    let heightOne = maleSum / maleCount;
    let heightTwo = femaleSum / femaleCount;
    let heightThree = unknownSum / unknownCount;

    return (
      <div className="App">
        <div className="container">
          <div className="graphBox">
            <div><p>A study into the average lifespans by known male, female and unknown gender. *Although many unknown gender types exist, none had both birth and death years to calculate lifespan.</p></div>
            <div className="barMale" style={{"height": heightOne *2 + "px"}}>Average Male Lifespan:{heightOne}</div>
            <div className="barFemale" style={{"height": heightTwo *2 + "px"}}>Average Female Lifespan:{heightTwo}</div>
            <div className="barUnknown" style={{"height": heightThree *2 + "px"}}>{heightThree}(*)</div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
