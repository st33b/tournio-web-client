
const MassActions = () => {
  return (
    <div>
      <h5>
        Bulk Actions
      </h5>
      <div className="row">
        <div className={"col-12 me-3"}>
          Payment Reminder Email
          <button className={"btn btn-warning ms-3 disabled placeholder"}
                  onClick={() => {
                  }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MassActions;
