const Downloads = () => {
  return (
    <div>
      <h5>
        Downloads
      </h5>
      <div className="d-flex justify-content-around align-items-center flex-wrap">
        <a className={"btn btn-primary-outline disabled placeholder mb-3"}>
          Bowlers CSV
        </a>
        <a className={"btn btn-primary-outline disabled placeholder mb-3"}>
          Financial CSV
        </a>
        <a className={"btn btn-primary-outline disabled placeholder mb-3"}>
          IGBO-TS
        </a>
        <a className={"btn btn-primary-outline disabled placeholder mb-3"}>
          Sign-in Sheets
        </a>
      </div>
    </div>
  );
};

export default Downloads;
