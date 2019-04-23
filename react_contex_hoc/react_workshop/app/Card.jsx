import React from 'react';

import withTheme from "./withTheme";
import styles from './styles';

const Card = ({themeData}) => (
	<div style={styles[themeData.theme]}>
		<h1>Cards</h1>
		<p>{themeData.themes.toString()}</p>
	</div>
)

export default withTheme(Card);