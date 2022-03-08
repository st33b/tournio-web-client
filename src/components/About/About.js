
import classes from './About.module.scss';
import {Accordion} from "react-bootstrap";

const about = () => (
  <div className={classes.About}>
    <Accordion defaultActiveKey={'0'} flush>
      <Accordion.Item eventKey={'0'}>
        <Accordion.Header>
          About this site...
        </Accordion.Header>
        <Accordion.Body>
          <p>
            This site is intended to be a low-cost, low-effort way for IGBO tournament directors to offer their bowlers online registration and purchase of optional events and products, as well as to prepare for their tournaments by consolidating and correcting data, monitoring the receipt of payments, and offering the export of registration data in spreadsheet format (comma-separated value, or CSV) as well as a format suitable for import into the IGBO-TS software.
          </p>
          <p>
            When bowlers pay their registration fees and purchase optional events, the transactions are made directly with PayPal using each tournament's client identifier; no funds pass through this system. Thus, the system charges no transaction fees.
          </p>
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey={'1'}>
        <Accordion.Header>
          Participating tournaments
        </Accordion.Header>
        <Accordion.Body>
          <p>
            I am proud to say the number of tournaments using this system continues to grow. Past and present tournaments include:
            <ul>
              <li>
                <a href={'https://www.bigdclassic.com/'}>Big D Classic</a>
              </li>
              <li>
                <a href={'http://trotbowling.com/'}>Texas Roll-off Tournament (TROT)</a>
              </li>
              <li>
                <a href={'http://www.houstoninvite.com/'}>Houston Invitational Tournament (HIT)</a>
              </li>
              <li>
                <a href={'https://www.okclassic.com/'}>OKClassic</a>
              </li>
              <li>
                <a href={'https://www.goldengateclassic.org/'}>San Francisco Golden Gate Classic</a>
              </li>
              <li>
                Dallas Area Masters Invitational Tournament (DAMIT)
              </li>
              <li>
                <a href={'https://www.txsuperslam.com/'}>Texas Super Slam</a>
              </li>
            </ul>
            ... with more to come!
          </p>
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey={'2'}>
        <Accordion.Header>
          Pricing
        </Accordion.Header>
        <Accordion.Body>
          <p>
            While I do charge a fee for the use of this system, the fee is intended to cover the costs I incur in operating it, not to turn a profit. If the day should arrive when there are enough participating tournaments to turn a profit, then all proceeds beyond operating costs will be donated to{' '}
            <a href={'https://www.aidslifecycle.org/'}>
              AIDS/LifeCycle
            </a>.
          </p>
          <ul>
            <li>
              I run the informational sites for a few tournaments; for them, my fee is $150/year for the website and registration bundle.
            </li>
            <li>
              For other tournaments, the fee for using the registration system is equivalent to one tournament entry fee. Of course, this varies from tournament to tournament, but it effectively makes the fee equivalent to the cost of a free entry.
            </li>
          </ul>
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey={'3'}>
        <Accordion.Header>
          For Tournament Directors
        </Accordion.Header>
        <Accordion.Body>
        <p>
          In a nutshell, here are the main features/actions the director interface lets you do:
          <ul>
            <li>
              Correct bowler and team information
            </li>
            <li>
              Move a bowler to a different team. This allows you to consolidate partial team registrations.
            </li>
            <li>
              Remove duplicate registrations. (Try as I might to prevent it, it happens.)
            </li>
            <li>
              Create free entry codes, and link free entry codes with registered bowlers.
            </li>
            <li>
              Export registration information, in both spreadsheet (CSV) and IGBO-TS formats. (The IGBO-TS format is suitable for import into the IGBO-TS program.)
            </li>
            <li>
              Run registration in Test Mode before opening it to the public.
            </li>
            <li>
              When registration is in Test Mode, you can clear out all test data, which is what you should do just before you're ready to open registration to the public.
            </li>
            <li>
              In Test Mode, simulate registrations happening during the early, regular, and late registration periods, to verify the proper discount/fee gets applied.
            </li>
            <li>
              You can close registration with a single button press when you're ready, or when you've reached capacity.
            </li>
          </ul>
        </p>
        <p>
          I've got a big list of features I'm working on adding to the system in the coming months, all based on feedback I've received from other tournament directors. This list includes:
          <ul>
            <li>
              Ability for a tournament director to upload an image to use as logo, along with other assets, like PDFs for rules and results.
            </li>
            <li>
              More control over configuration details, including choosing which optional registration questions to include in the form, e.g., preferred pronouns.
            </li>
            <li>
              Mark bowlers as paid via a mechanism outside of PayPal, e.g., cash or check.
            </li>
            <li>
              Improved experience for bowlers in the time period between registration closing and the tournament's start date.
            </li>
            <li>
              Being added to a waiting list for a full tournament.
            </li>
            <li>
              Support for tournaments with multiple shifts
            </li>
            <li>
              The ability to save registration data for use on future tournaments, to make registration even faster.
            </li>
            <li>
              Support for tournaments with non-traditional formats.
            </li>
          </ul>
        </p>
        <p>Interested in using the system for your tournament?{' '}
          <a href={'mailto:info@igbo-reg.com'}>
            Drop me a line
          </a>!
        </p>
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey={'4'}>
        <Accordion.Header>
          How this site came to be
        </Accordion.Header>
        <Accordion.Body>
          <img src={'/images/scott-bowling.jpg'}
               alt={'The system author bowling, back when times were simpler.'}
               className={'img-fluid float-end ps-3'}
          />
          <p>
            I began bowling in IGBO leagues and tournaments in 2004, and have been a participant on some level ever since. (I even threw my first&mdash;and, to date, only&mdash;perfect game at IGBO Annual in Atlanta in 2008.) So the IGBO community has been an important part of my life for going on two decades now!
          </p>
          <p>
            When I learned in 2015 that the operator of the excellent{' '}
            <code>
              TournReg.net
            </code>, the system used by most IGBO tournaments for their online registration, planned to retire the system, I saw an opportunity to use my skills to give back to the community. My profession is developing software, particularly web-based software, so I saw this as a chance to both give back and deepen my own skills. Later, as my career saw me branching off into people management, maintaining this system would also serve as a way of keeping my technical skills up to snuff.
          </p>
          <p>
            So, in the summer of 2015 while in between jobs,{' '}
            <code>
              igbo-reg.com
            </code>
            {' '}was born. Like so many software projects, the first version was overly complicated, difficult to maintain, and not very easy to use, for either me or for tournament directors. I quickly replaced it with a version designed to solve the most common use cases first, and it found success with a small number of tournaments.
          </p>
          <p>
            The lull in tournaments created by the coronavirus pandemic in 2020 and 2021 presented an opportunity to incorporate feedback I'd received about the system over the years and completely rebuild it from the ground up. In doing so, I completely rebuilt both the registration and administration experiences, in order to allow bowlers an easier, more seamless and thorough registration experience, and to provide tournament directors with greater control and flexibility in how they run their tournaments.
          </p>
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey={5}>
        <Accordion.Header>
          Disclaimers &amp; Technical Details
        </Accordion.Header>
        <Accordion.Body>
          <p>
            This website has no official affiliation with IGBO. I've simply built it specifically for use by IGBO tournaments.
          </p>
          <p>
            This website is designed to work with all modern browsers, regardless of device. On desktops, though, I recommend using{' '}
            <a href={'https://www.mozilla.org/en-US/firefox/new/'}>
              Mozilla Firefox
            </a>.
          </p>
          <p>
            Interested in the source code? It's in two parts, available on <i className={'bi-github'} /> Github:
            <ul>
              <li>
                <a href={'https://github.com/st33b/igbo-registration-api'}>
                  Server back end
                </a>
              </li>
              <li>
                <a href={'https://github.com/st33b/igbo-registration-client'}>
                  Client front end
                </a>
              </li>
            </ul>
          </p>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </div>
);

export default about;