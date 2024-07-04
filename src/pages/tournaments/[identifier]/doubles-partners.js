import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import {devConsoleLog} from "../../../utils";

// NOTE: This file is no longer used. I'm keeping it around to preserve the automatic
// assignment function.

const Page = () => {
  devConsoleLog("------------ page untouched in team restoration");
  return '';

  // When a doubles partner is clicked, what needs to happen:
  // - update the double partner assignments in state. (One click is enough to know everyone.)
  //  - Ex: Bowler A clicked on Bowler B
  //  - set A's partner to be B
  //  - set B's partner to be A (reciprocal)
  //  - set C and D to be partners (the remaining two)
  // const gimmeNewDoublesPartners = (bowlerIndex, partnerIndex) => {
  //   // create a copy of the bowlers array
  //   const newBowlers = registration.team.bowlers.slice(0);
  //
  //   // Shouldn't happen, but just in case
  //   if (newBowlers[bowlerIndex].doublesPartnerIndex === partnerIndex) {
  //     devConsoleLog("Something ain't right, you're trying to partner someone up with themselves.");
  //     // Nothing is changing, so...
  //     return;
  //   }
  //
  //   let bowlersLeftToUpdate = [...newBowlers.keys()];
  //   newBowlers[bowlerIndex].doublesPartnerIndex = partnerIndex;
  //   newBowlers[partnerIndex].doublesPartnerIndex = bowlerIndex;
  //
  //   // Remove those two from the list of bowlers who need to be updated
  //   bowlersLeftToUpdate = bowlersLeftToUpdate.filter((value) => {
  //     return value !== bowlerIndex && value !== partnerIndex;
  //   });
  //
  //   // Update the other two (if there are two) to be partners with each other
  //   if (bowlersLeftToUpdate.length > 1) {
  //     const left = bowlersLeftToUpdate[0];
  //     const right = bowlersLeftToUpdate[1];
  //     newBowlers[left].doublesPartnerIndex = right;
  //     newBowlers[right].doublesPartnerIndex = left;
  //   } else if (bowlersLeftToUpdate.length === 1) {
  //     // If there's just one left, then nullify their doubles partner selection
  //     newBowlers[bowlersLeftToUpdate[0]].doublesPartnerIndex = null;
  //   }
  // }
}

Page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default Page;
