import Link from "next/link";

const LinksAndCounts = () => {
  return (
    <div>
      <div className="row pb-3">
        <span className={"col me-3"}>
          <Link href={'#'}
                className={''}>
            Bowlers
          </Link>
        </span>
        <span className={"placeholder col-2 col-md-2 col-lg-1"}></span>
      </div>

      {/* if the tournament is less than a month away, add a link directly to
        * a list of bowlers with outstanding payments. (Yes, it's a subset of
        * the above list, but is probably the most useful to directors, more
        * useful than a list of all bowlers.)
        */}
      <div className="row pb-3">
        <span className={"col me-3"}>
          <Link href={'#'}
                className={'ms-3'}>
            Unpaid Bowlers
          </Link>
        </span>
        <span className={"placeholder col-2 col-md-2 col-lg-1"}></span>
      </div>

      {/* if the tournament has a team event... */}
      <div className="row pb-3">
        <span className={"col me-3"}>
          <Link href={'#'}
                className={''}>
            Teams
          </Link>
        </span>
        <span className={"placeholder col-2 col-md-2 col-lg-1"}></span>
      </div>

      {/* if the tournament is using free entry codes */}
      <div className="row pb-3">
        <span className={"col me-3"}>
          <Link href={'#'}
                className={''}>
            Free Entries
          </Link>
        </span>
        <span className={"placeholder col-2 col-md-2 col-lg-1"}></span>
      </div>
    </div>
  );
};

export default LinksAndCounts;
