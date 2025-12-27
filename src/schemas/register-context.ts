import { Rave } from 'ravejs';
import { z } from 'zod';

export const RegisterContextSchema = z.object({
  email: z.string(),
  idToken: z.string(),
  deviceId: z.string(),
  instance: z.instanceof(Rave),
});

export type RegisterContext = z.infer<typeof RegisterContextSchema>;
