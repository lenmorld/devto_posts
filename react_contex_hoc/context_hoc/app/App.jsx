import React from 'react';

import styles from './styles';

const Card = (props) => (
	<div style={styles[props.theme]}>
		<h1>Card</h1>
	</div>
)

const ThemedCard = (props) => <Card theme={props.theme} />
const Section = (props) => <ThemedCard theme={props.theme} />
const Container = (props) => <Section theme={props.theme} />

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
				<Container theme={this.state.theme}/>
			</div>
			
		);
	}
}

export default App;