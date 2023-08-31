const TournamentHeader = ({tournament}) => (
  <>
    <div className={`display-2 text-center mt-3`}>
      {tournament.abbreviation} {tournament.year}
    </div>

    <hr />
  </>
);

export default TournamentHeader;
