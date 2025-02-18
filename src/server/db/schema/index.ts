import * as authSchema from "./auth-schema";
import * as familySchema from "./schema";

export const schema = { ...familySchema, ...authSchema };
