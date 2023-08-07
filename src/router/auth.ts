import {
  email,
  minLength,
  object,
  type Output,
  parse,
  string,
  type ValiError,
} from 'valibot';

import { Router } from 'oak';
import { Status } from 'https://deno.land/std@0.193.0/http/http_status.ts';
import { supabase } from '../supabase/client.ts';
import * as bcrypt from 'bcrypt';

const LoginSchema = object({
  email: string([email()]),
  password: string([minLength(4)]),
});

// Infer output TypeScript type of login schema
type LoginData = Output<typeof LoginSchema>;

const authRouter = new Router();

authRouter
  .prefix('/api')
  .post('/login', async (context) => {
    const body = await context.request.body({ type: 'json' }).value;

    try {
      const creds = parse(LoginSchema, body);

      const userSelect = await supabase
        .from('users')
        .select('email, password')
        .eq('email', creds.email)
        .single();

      if (userSelect.status >= 400) {
        context.response.status = Status.UnprocessableEntity;
        context.response.body = {
          error: 'Invalid email or password.',
        };

        return;
      }

      // Check if a session already exists.

      if (
        !await bcrypt.compare(
          creds.password,
          userSelect.data?.password!,
        )
      ) {
        context.response.status = Status.UnprocessableEntity;
        context.response.body = {
          error: 'Invalid email or password.',
        };

        return;
      }

      context.response.status = Status.OK;
      context.response.body = {
        data: {
          email: userSelect.data?.email,
        },
      };
    } catch (error) {
      context.response.status = Status.UnprocessableEntity;
      context.response.body = {
        error: (error as ValiError).message,
      };
    }
  });

export { authRouter };
