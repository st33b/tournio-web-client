import * as actionTypes from '../../../src/store/actions/actionTypes';
import {extractApparelFromItems} from "../../../src/store/commerceReducer";

describe ('function: extractApparelFromItems', () => {
  const input = {
      "54a670eb-b129-4dab-a201-ff3c265095e5": {
        "identifier": "54a670eb-b129-4dab-a201-ff3c265095e5",
        "category": "ledger",
        "configuration": {},
        "determination": "entry_fee",
        "name": "Entry Fee",
        "refinement": null,
        "value": 120
      },
      "0550f837-a192-4582-9037-3ac0b935603c": {
        "identifier": "0550f837-a192-4582-9037-3ac0b935603c",
        "category": "ledger",
        "configuration": {
          "applies_at": "2023-07-17T00:00:00-04:00"
        },
        "determination": "late_fee",
        "name": "Late Registration Fee",
        "refinement": null,
        "value": 15
      },
      "3f00be83-bd40-466e-b09d-21bbe8ccf4e6": {
        "identifier": "3f00be83-bd40-466e-b09d-21bbe8ccf4e6",
        "category": "ledger",
        "configuration": {
          "valid_until": "2023-06-12T00:00:00-04:00"
        },
        "determination": "early_discount",
        "name": "Early Registration Discount",
        "refinement": null,
        "value": 10
      },
      "95983cee-11cf-42f1-8c97-2727f7c90ca7": {
        "identifier": "95983cee-11cf-42f1-8c97-2727f7c90ca7",
        "category": "sanction",
        "configuration": {
          "order": 1
        },
        "determination": "igbo",
        "name": "IGBO Membership",
        "refinement": null,
        "value": 25
      },
      "39c0f28c-4fd2-40c7-9483-cee1a5bbd701": {
        "identifier": "39c0f28c-4fd2-40c7-9483-cee1a5bbd701",
        "category": "bowling",
        "configuration": {
          "note": "",
          "order": 2
        },
        "determination": "single_use",
        "name": "3 of 9",
        "refinement": null,
        "value": 15
      },
      "853ca77d-8581-4b37-b058-4718954913fb": {
        "identifier": "853ca77d-8581-4b37-b058-4718954913fb",
        "category": "sanction",
        "configuration": {
          "order": 2
        },
        "determination": "igbo",
        "name": "IGBO Associate Fee",
        "refinement": null,
        "value": 5
      },
      "ba13893c-779a-480b-98d8-c2fda9701364": {
        "identifier": "ba13893c-779a-480b-98d8-c2fda9701364",
        "category": "banquet",
        "configuration": {
          "note": "om nom nom",
          "order": 9,
          "denomination": ""
        },
        "determination": "multi_use",
        "name": "noms",
        "refinement": null,
        "value": 45
      },
      "9ee069e7-7570-48a8-85b6-8e41ee3c3fd6": {
        "identifier": "9ee069e7-7570-48a8-85b6-8e41ee3c3fd6",
        "category": "product",
        "configuration": {
          "note": "For your head",
          "size": "one_size_fits_all",
          "order": 1
        },
        "determination": "apparel",
        "name": "A pretty hat",
        "refinement": null,
        "value": 20
      },
      "16fc9409-7260-410d-9813-cdbc8633a88d": {
        "identifier": "16fc9409-7260-410d-9813-cdbc8633a88d",
        "category": "product",
        "configuration": {
          "note": "cuz it's chilly and you're shilly",
          "size": "women.xs",
          "order": 2,
          "sizes": null,
          "parent_identifier": "37d7ccfe-4afb-4ded-9858-aa9d2764d103"
        },
        "determination": "apparel",
        "name": "Logo Sweater",
        "refinement": null,
        "value": 50
      },
      "1278d2ef-352d-4f8e-b228-53038293a91b": {
        "identifier": "1278d2ef-352d-4f8e-b228-53038293a91b",
        "category": "product",
        "configuration": {
          "note": "cuz it's chilly and you're shilly",
          "size": "women.s",
          "order": 2,
          "sizes": null,
          "parent_identifier": "37d7ccfe-4afb-4ded-9858-aa9d2764d103"
        },
        "determination": "apparel",
        "name": "Logo Sweater",
        "refinement": null,
        "value": 50
      },
      "fc14f9e7-d5e2-4306-9e8d-7c2984a96cee": {
        "identifier": "fc14f9e7-d5e2-4306-9e8d-7c2984a96cee",
        "category": "product",
        "configuration": {
          "note": "cuz it's chilly and you're shilly",
          "size": "women.m",
          "order": 2,
          "sizes": null,
          "parent_identifier": "37d7ccfe-4afb-4ded-9858-aa9d2764d103"
        },
        "determination": "apparel",
        "name": "Logo Sweater",
        "refinement": null,
        "value": 50
      },
      "1206fd9b-7804-44f9-8efc-36298b3ae189": {
        "identifier": "1206fd9b-7804-44f9-8efc-36298b3ae189",
        "category": "product",
        "configuration": {
          "note": "cuz it's chilly and you're shilly",
          "size": "men.m",
          "order": 2,
          "sizes": null,
          "parent_identifier": "37d7ccfe-4afb-4ded-9858-aa9d2764d103"
        },
        "determination": "apparel",
        "name": "Logo Sweater",
        "refinement": null,
        "value": 50
      },
      "8513db5c-799f-4e4a-b490-ae3a540603bf": {
        "identifier": "8513db5c-799f-4e4a-b490-ae3a540603bf",
        "category": "product",
        "configuration": {
          "note": "cuz it's chilly and you're shilly",
          "size": "men.l",
          "order": 2,
          "sizes": null,
          "parent_identifier": "37d7ccfe-4afb-4ded-9858-aa9d2764d103"
        },
        "determination": "apparel",
        "name": "Logo Sweater",
        "refinement": null,
        "value": 50
      },
      "c74fc573-7594-4918-867a-5bb06eadb87b": {
        "identifier": "c74fc573-7594-4918-867a-5bb06eadb87b",
        "category": "product",
        "configuration": {
          "note": "cuz it's chilly and you're shilly",
          "size": "men.xl",
          "order": 2,
          "sizes": null,
          "parent_identifier": "37d7ccfe-4afb-4ded-9858-aa9d2764d103"
        },
        "determination": "apparel",
        "name": "Logo Sweater",
        "refinement": null,
        "value": 50
      },
      "c1f97895-007e-41ff-83ee-9b8d0a62abbb": {
        "identifier": "c1f97895-007e-41ff-83ee-9b8d0a62abbb",
        "category": "product",
        "configuration": {
          "note": "cuz it's chilly and you're shilly",
          "size": "infant.m24",
          "order": 2,
          "sizes": null,
          "parent_identifier": "37d7ccfe-4afb-4ded-9858-aa9d2764d103"
        },
        "determination": "apparel",
        "name": "Logo Sweater",
        "refinement": null,
        "value": 50
      },
      "37d7ccfe-4afb-4ded-9858-aa9d2764d103": {
        "identifier": "37d7ccfe-4afb-4ded-9858-aa9d2764d103",
        "category": "product",
        "configuration": {
          "note": "cuz it's chilly and you're shilly",
          "order": 2,
          "sizes": null
        },
        "determination": "apparel",
        "name": "Logo Sweater",
        "refinement": "sized",
        "value": 50
      },
      "d3854db0-c9ca-4742-addc-965d0cafc84f": {
        "identifier": "d3854db0-c9ca-4742-addc-965d0cafc84f",
        "category": "product",
        "configuration": {
          "note": "your arms are warm",
          "size": "women.l",
          "order": 3,
          "parent_identifier": "28c21b5d-c6ae-4e79-9383-9c4dc258ea22"
        },
        "determination": "apparel",
        "name": "Vest",
        "refinement": null,
        "value": 29
      },
      "3017e7b2-ff92-4dda-bd2a-d43fd01a1e64": {
        "identifier": "3017e7b2-ff92-4dda-bd2a-d43fd01a1e64",
        "category": "product",
        "configuration": {
          "note": "your arms are warm",
          "size": "women.xl",
          "order": 3,
          "parent_identifier": "28c21b5d-c6ae-4e79-9383-9c4dc258ea22"
        },
        "determination": "apparel",
        "name": "Vest",
        "refinement": null,
        "value": 29
      },
      "23387cef-f33a-420f-aae4-a0056705f0a5": {
        "identifier": "23387cef-f33a-420f-aae4-a0056705f0a5",
        "category": "product",
        "configuration": {
          "note": "your arms are warm",
          "size": "women.xxl",
          "order": 3,
          "parent_identifier": "28c21b5d-c6ae-4e79-9383-9c4dc258ea22"
        },
        "determination": "apparel",
        "name": "Vest",
        "refinement": null,
        "value": 29
      },
      "76c198f6-a85f-4dd5-9d47-e623b181d702": {
        "identifier": "76c198f6-a85f-4dd5-9d47-e623b181d702",
        "category": "product",
        "configuration": {
          "note": "your arms are warm",
          "size": "men.xs",
          "order": 3,
          "parent_identifier": "28c21b5d-c6ae-4e79-9383-9c4dc258ea22"
        },
        "determination": "apparel",
        "name": "Vest",
        "refinement": null,
        "value": 29
      },
      "18fb1e46-5438-4cab-8500-79603896f399": {
        "identifier": "18fb1e46-5438-4cab-8500-79603896f399",
        "category": "product",
        "configuration": {
          "note": "your arms are warm",
          "size": "men.s",
          "order": 3,
          "parent_identifier": "28c21b5d-c6ae-4e79-9383-9c4dc258ea22"
        },
        "determination": "apparel",
        "name": "Vest",
        "refinement": null,
        "value": 29
      },
      "0934f69b-d2c8-4b76-ad14-6be52acac0e0": {
        "identifier": "0934f69b-d2c8-4b76-ad14-6be52acac0e0",
        "category": "product",
        "configuration": {
          "note": "your arms are warm",
          "size": "men.m",
          "order": 3,
          "parent_identifier": "28c21b5d-c6ae-4e79-9383-9c4dc258ea22"
        },
        "determination": "apparel",
        "name": "Vest",
        "refinement": null,
        "value": 29
      },
      "dee27cf8-bcd8-463a-b881-7f8b3e9ebe72": {
        "identifier": "dee27cf8-bcd8-463a-b881-7f8b3e9ebe72",
        "category": "product",
        "configuration": {
          "note": "your arms are warm",
          "size": "infant.m12",
          "order": 3,
          "parent_identifier": "28c21b5d-c6ae-4e79-9383-9c4dc258ea22"
        },
        "determination": "apparel",
        "name": "Vest",
        "refinement": null,
        "value": 29
      },
      "6a83cb55-3172-4a58-b67f-4969e3ec89ec": {
        "identifier": "6a83cb55-3172-4a58-b67f-4969e3ec89ec",
        "category": "product",
        "configuration": {
          "note": "your arms are warm",
          "size": "infant.m18",
          "order": 3,
          "parent_identifier": "28c21b5d-c6ae-4e79-9383-9c4dc258ea22"
        },
        "determination": "apparel",
        "name": "Vest",
        "refinement": null,
        "value": 29
      },
      "c0df731c-d22d-4a74-aa43-c83c1a1ee5e2": {
        "identifier": "c0df731c-d22d-4a74-aa43-c83c1a1ee5e2",
        "category": "product",
        "configuration": {
          "note": "your arms are warm",
          "size": "infant.m24",
          "order": 3,
          "parent_identifier": "28c21b5d-c6ae-4e79-9383-9c4dc258ea22"
        },
        "determination": "apparel",
        "name": "Vest",
        "refinement": null,
        "value": 29
      },
      "28c21b5d-c6ae-4e79-9383-9c4dc258ea22": {
        "identifier": "28c21b5d-c6ae-4e79-9383-9c4dc258ea22",
        "category": "product",
        "configuration": {
          "note": "your arms are warm",
          "order": 3
        },
        "determination": "apparel",
        "name": "Vest",
        "refinement": "sized",
        "value": 29
      }
    }

  const expectedOutput = {
    items: {
      "54a670eb-b129-4dab-a201-ff3c265095e5": {
        "identifier": "54a670eb-b129-4dab-a201-ff3c265095e5",
        "category": "ledger",
        "configuration": {},
        "determination": "entry_fee",
        "name": "Entry Fee",
        "refinement": null,
        "value": 120
      },
      "0550f837-a192-4582-9037-3ac0b935603c": {
        "identifier": "0550f837-a192-4582-9037-3ac0b935603c",
        "category": "ledger",
        "configuration": {
          "applies_at": "2023-07-17T00:00:00-04:00"
        },
        "determination": "late_fee",
        "name": "Late Registration Fee",
        "refinement": null,
        "value": 15
      },
      "3f00be83-bd40-466e-b09d-21bbe8ccf4e6": {
        "identifier": "3f00be83-bd40-466e-b09d-21bbe8ccf4e6",
        "category": "ledger",
        "configuration": {
          "valid_until": "2023-06-12T00:00:00-04:00"
        },
        "determination": "early_discount",
        "name": "Early Registration Discount",
        "refinement": null,
        "value": 10
      },
      "95983cee-11cf-42f1-8c97-2727f7c90ca7": {
        "identifier": "95983cee-11cf-42f1-8c97-2727f7c90ca7",
        "category": "sanction",
        "configuration": {
          "order": 1
        },
        "determination": "igbo",
        "name": "IGBO Membership",
        "refinement": null,
        "value": 25
      },
      "39c0f28c-4fd2-40c7-9483-cee1a5bbd701": {
        "identifier": "39c0f28c-4fd2-40c7-9483-cee1a5bbd701",
        "category": "bowling",
        "configuration": {
          "note": "",
          "order": 2
        },
        "determination": "single_use",
        "name": "3 of 9",
        "refinement": null,
        "value": 15
      },
      "853ca77d-8581-4b37-b058-4718954913fb": {
        "identifier": "853ca77d-8581-4b37-b058-4718954913fb",
        "category": "sanction",
        "configuration": {
          "order": 2
        },
        "determination": "igbo",
        "name": "IGBO Associate Fee",
        "refinement": null,
        "value": 5
      },
      "ba13893c-779a-480b-98d8-c2fda9701364": {
        "identifier": "ba13893c-779a-480b-98d8-c2fda9701364",
        "category": "banquet",
        "configuration": {
          "note": "om nom nom",
          "order": 9,
          "denomination": ""
        },
        "determination": "multi_use",
        "name": "noms",
        "refinement": null,
        "value": 45
      },
    },
    apparelItems: {
      "9ee069e7-7570-48a8-85b6-8e41ee3c3fd6": {
        "identifier": "9ee069e7-7570-48a8-85b6-8e41ee3c3fd6",
        "category": "product",
        "configuration": {
          "note": "For your head",
          "size": "one_size_fits_all",
          "order": 1
        },
        "determination": "apparel",
        "name": "A pretty hat",
        "refinement": null,
        "value": 20
      },
      "37d7ccfe-4afb-4ded-9858-aa9d2764d103": {
        "identifier": "37d7ccfe-4afb-4ded-9858-aa9d2764d103",
        "category": "product",
        "configuration": {
          "note": "cuz it's chilly and you're shilly",
          "order": 2,
          sizes: [
            {
              identifier: "16fc9409-7260-410d-9813-cdbc8633a88d",
              size: "women.xs",
            },
            {
              identifier: "1278d2ef-352d-4f8e-b228-53038293a91b",
              size: "women.s",
            },
            {
              identifier: "fc14f9e7-d5e2-4306-9e8d-7c2984a96cee",
              size: "women.m",
            },
            {
              identifier: "1206fd9b-7804-44f9-8efc-36298b3ae189",
              size: "men.m",
            },
            {
              identifier: "8513db5c-799f-4e4a-b490-ae3a540603bf",
              size: "men.l",
            },
            {
              identifier: "c74fc573-7594-4918-867a-5bb06eadb87b",
              size: "men.xl",
            },
            {
              identifier: "c1f97895-007e-41ff-83ee-9b8d0a62abbb",
              size: "infant.m24",
            },
          ]
        },
        "determination": "apparel",
        "name": "Logo Sweater",
        "refinement": "sized",
        "value": 50
      },
      "28c21b5d-c6ae-4e79-9383-9c4dc258ea22": {
        "identifier": "28c21b5d-c6ae-4e79-9383-9c4dc258ea22",
        "category": "product",
        "configuration": {
          "note": "your arms are warm",
          "order": 3,
          sizes: [
            {
              identifier: "d3854db0-c9ca-4742-addc-965d0cafc84f",
              size: "women.l",
            },
            {
              identifier: "3017e7b2-ff92-4dda-bd2a-d43fd01a1e64",
              size: "women.xl",
            },
            {
              identifier: "23387cef-f33a-420f-aae4-a0056705f0a5",
              size: "women.xxl",
            },
            {
              identifier: "76c198f6-a85f-4dd5-9d47-e623b181d702",
              size: "men.xs",
            },
            {
              identifier: "18fb1e46-5438-4cab-8500-79603896f399",
              size: "men.s",
            },
            {
              identifier: "0934f69b-d2c8-4b76-ad14-6be52acac0e0",
              size: "men.m",
            },
            {
              identifier: "dee27cf8-bcd8-463a-b881-7f8b3e9ebe72",
              size: "infant.m12",
            },
            {
              identifier: "6a83cb55-3172-4a58-b67f-4969e3ec89ec",
              size: "infant.m18",
            },
            {
              identifier: "c0df731c-d22d-4a74-aa43-c83c1a1ee5e2",
              size: "infant.m24",
            },
          ],
        },
        "determination": "apparel",
        "name": "Vest",
        "refinement": "sized",
        "value": 29
      },
    },
  };

  it ('returns a object splitting apparel items from non-apparel items', () => {
    const result = extractApparelFromItems(input);
    expect(result).toStrictEqual(expectedOutput);
  });
});
