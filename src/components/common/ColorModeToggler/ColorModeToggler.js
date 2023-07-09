import Link from 'next/link';
import {useThemeContext} from "../../../store/ThemeContext";
import {useClientReady} from "../../../utils";
import classes from './ColorModeToggler.module.scss';

const ColorModeToggler = (props) => {
  const themeLinkContents = {
    auto: {
      iconClass: 'bi-circle-half',
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

  const {theme, updatePreferredTheme} = useThemeContext();

  const ready = useClientReady();
  if (!ready) {
    return null;
  }

  const themeClicked = (event) => {
    event.preventDefault();
    updatePreferredTheme(event.target.name);
  }

  const preferredIconClass = !!theme.preferred ? themeLinkContents[theme.preferred].iconClass : themeLinkContents.auto.iconClass;

  return (
    <div className={`${classes.ColorModeToggler} ${props.className} dropdown`}>
      <button className={'btn dropdown-toggle'}
              type={'button'}
              title={'Set the color mode'}
              data-bs-toggle={'dropdown'}
              aria-expanded={false}>
        <i className={`bi ${preferredIconClass}`} aria-hidden={true}/>
        <span className={'visually-hidden'}>
          {theme.preferred}
        </span>
      </button>
      <ul className={'dropdown-menu dropdown-menu-end'}>
        {Object.keys(themeLinkContents).map(t => (
          <li key={`theme_chooser_${t} ${classes.ThemeItem}`}>
            <Link href={'#'}
               className={'dropdown-item'}
               name={t}
               onClick={themeClicked}>
              <i className={`${themeLinkContents[t].iconClass} pe-2`} aria-hidden={true}/>
              {themeLinkContents[t].ariaText}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ColorModeToggler;
