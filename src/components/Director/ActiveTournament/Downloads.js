import classes from './ActiveTournament.module.scss';
import CardHeader from "./CardHeader";
import {useRouter} from "next/router";

const Downloads = ({tournament}) => {
  const router = useRouter();

  if (!tournament || !router.isReady) {
    return '';
  }

  return (
    <div className={classes.Downloads}>
      <div className={'card mb-3'}>
        <CardHeader headerText={'Downloads'}/>

        <div className={'list-group list-group-flush'}>
          <button disabled={tournament.bowlerCount === 0}
                  className={'list-group-item list-group-item-action'}
                  onClick={() => {
                  }}
          >
            <i className={'bi bi-download pe-2'}
               aria-hidden={"true"}/>
            Bowler CSV
          </button>

          <button disabled={false}
                  className={'list-group-item list-group-item-action'}
                  onClick={() => {
                  }}
          >
            <i className={'bi bi-download pe-2'}
               aria-hidden={"true"}/>
            Financial CSV
          </button>

          <button disabled={tournament.bowlerCount === 0}
                  className={'list-group-item list-group-item-action'}
                  onClick={() => {
                  }}
          >
            <i className={'bi bi-download pe-2'}
               aria-hidden={"true"}/>
            IGBO-TS
          </button>

          <a href={`router.asPath/sign-in-sheets`}
             target={'_blank'}
             title={'Open the sign-in sheets in a new window'}
             className={`list-group-item list-group-item-action`}
             onClick={() => {
             }}
          >
            Sign-in Sheets
            <i className={`bi bi-box-arrow-up-right ${classes.ExternalLink}`}
               aria-hidden={"true"}/>
          </a>
        </div>
      </div>
      {/*<div className="d-flex justify-content-around align-items-center flex-wrap">*/}
      {/*  <a className={"btn btn-primary-outline disabled placeholder mb-3"}>*/}
      {/*    Bowlers CSV*/}
      {/*  </a>*/}
      {/*  <a className={"btn btn-primary-outline disabled placeholder mb-3"}>*/}
      {/*    Financial CSV*/}
      {/*  </a>*/}
      {/*  <a className={"btn btn-primary-outline disabled placeholder mb-3"}>*/}
      {/*    IGBO-TS*/}
      {/*  </a>*/}
      {/*  <a className={"btn btn-primary-outline disabled placeholder mb-3"}>*/}
      {/*    Sign-in Sheets*/}
      {/*  </a>*/}
      {/*</div>*/}
    </div>
  );
};

export default Downloads;
