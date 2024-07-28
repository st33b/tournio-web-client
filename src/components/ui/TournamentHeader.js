import Link from "next/link";
import TournamentLogo from "../Registration/TournamentLogo/TournamentLogo";
import React from "react";

const TournamentHeader = ({tournament}) => (
  <>
    <div className={'row d-flex d-md-none'}>
      <div className={'col-5'}>
        <Link href={`/tournaments/${tournament.identifier}`}>
          <TournamentLogo url={tournament.imageUrl} additionalClasses={''}/>
        </Link>
      </div>
      <p className={'col-7 display-4 align-self-center'}>
        {tournament.abbreviation} {tournament.year}
      </p>
    </div>

    <div className={'row d-none d-md-flex justify-content-start'}>
      {/* Medium viewports and larger */}
      <div className={'col-2'}>
        <Link href={`/tournaments/${tournament.identifier}`}>
          <TournamentLogo url={tournament.imageUrl}/>
        </Link>
      </div>
      <div className={'col align-self-center'}>
        <p className={'display-5'}>
          {tournament.name} {tournament.year}
        </p>
      </div>
    </div>

    <hr/>
  </>
);

export default TournamentHeader;
