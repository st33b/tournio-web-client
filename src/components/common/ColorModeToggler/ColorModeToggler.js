import classes from './ColorModeTogger.module.scss';

const ColorModeToggler = ({activeTheme, preferredTheme, onThemeChosen, ...children}) => {
  const themeLinkContents = {
    auto: {
      iconClass: 'bi-arrow-repeat',
      ariaText: 'Automatic',
    },
    light: {
      iconClass: 'bi-sun-fill',
      ariaText: 'Light',
    },
    dark: {
      iconClass: 'bi-moon-fill',
      ariaText: 'Dark',
    },
  };

  const themeClicked = (event) => {
    event.preventDefault();
    onThemeChosen(event.target.name);
  }

  const preferredIconClass = themeLinkContents[preferredTheme].iconClass;

  return (
    <div className={`${classes.ColorModeToggler} ${children.className} dropdown`}>
      <button className={'btn dropdown-toggle'}
              type={'button'}
              data-bs-toggle={'dropdown'}
              aria-expanded={false}>
        <i className={`${preferredIconClass}`} aria-hidden={true}/>
        <span className={'visually-hidden'}>
          {preferredTheme}
        </span>
      </button>
      <ul className={'dropdown-menu'}>
        {Object.keys(themeLinkContents).map(theme => (
          <li key={`theme_chooser_${theme} ${classes.ThemeItem}`}>
            <a href={'#'}
               className={'dropdown-item'}
               name={theme}
               onClick={themeClicked}>
              <i className={`${themeLinkContents[theme].iconClass} pe-2`} aria-hidden={true}/>
              {themeLinkContents[theme].ariaText}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ColorModeToggler;
