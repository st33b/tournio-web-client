import {Record} from "immutable";

export const UserRecord = Record({
  identifier: null,
  email: null,
  role: null,
  first_name: null,
  last_name: null,
  last_sign_in_at: null,
  tournaments: null,
})