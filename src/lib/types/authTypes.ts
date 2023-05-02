type LogInInfo = {
  email: string;
  password: string;
  remember: boolean;
  MFACode?: string;
  rememberMultiFactor: boolean;
};

type SignUpInfo = {
  email: string;
  userName: string;
  password: string;
};

export type { LogInInfo, SignUpInfo };
