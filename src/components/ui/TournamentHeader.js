import Link from "next/link";

const TournamentHeader = ({tournament}) => (
  <>
    <div className={`display-2 text-center mt-3`}>
      <Link className={'icon-link'}
            href={`/tournaments/${tournament.identifier}`}>
        <i className={'bi bi-arrow-left'} aria-hidden={true}/>
        <span className={'visually-hidden'}>
          To tournament homepage
        </span>
      </Link>
      <span className={'ps-3'}>
      {tournament.abbreviation} {tournament.year}
      </span>
    </div>

    <hr />
  </>
);

export default TournamentHeader;
