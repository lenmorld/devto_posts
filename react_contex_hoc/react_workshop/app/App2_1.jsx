import React from 'react';

import ThemeContext from './ThemeContext';

import styles from './styles';

// import Card from './Card';

// const ThemedCard = (props) => <Card theme={props.theme} />

// 2

const Card = (props) => (
	<div style={styles[props.theme]}>
		<h1>Card</h1>
	</div>
)

const ThemedCard = () => (
	<ThemeContext.Consumer>
	  {({theme}) => <Card theme={theme} />}
	</ThemeContext.Consumer>
 )

const Section = () => <ThemedCard />

// const Section = (props) => <Card />

// const Container = (props) => <Section theme={props.theme} />

const Container = () => <Section />

class App extends React.Component {

	state = {
		theme: 'dark',
	}

	switchTheme = () => {
		const newTheme = this.state.theme === "dark" ? "default" : "dark";
		this.setState({
		  theme: newTheme
		});
	 };

	render() {
		return (
			<div>
			<button onClick={this.switchTheme}>Switch theme</button>
			<ThemeContext.Provider value={this.state}>
				 <Container />
			</ThemeContext.Provider>
 </div>
		);
	}
}

export default App;