// instead of a ThemedCard
// what if you want a ThemedButton, ThemedAvatar
// or any container of soemthing themed?
// use an HoC instead

import React from "react";

import ThemeContext from "./ThemeContext";

const withTheme = Component => {
  class ThemedComponent extends React.Component {

    static contextType = ThemeContext;

    componentDidMount() {
      console.log(`current theme:  ${ this.context.theme }`);
    }

    /*
        <ThemeContext.Consumer>
          {theme => <Component theme={theme} />}
        </ThemeContext.Consumer>
    */

    render() {
      return (
        <Component themeData={this.context} />
      );
    }
  }

  return ThemedComponent;
};

export default withTheme;

/*

const ThemedCard = props => (
  <ThemeContext.Consumer>
    {theme => <Card theme={theme} {...props} />}
  </ThemeContext.Consumer>
);
*/

/*

export function withTheme(Component) {
  return function ThemeComponent(props) {
    return (
      <ThemeContext.Consumer>
        {(contexts) => <Component {...props} {...contexts} />
        }
      </ThemeContext.Consumer>
    )
  }
}
*/
