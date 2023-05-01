type LogInInfo = {
  email: string;
  password: string;
  remember: boolean;
  MFACode?: string;
};

type SignUpInfo = {
  email: string;
  userName: string;
  password: string;
};

export type { LogInInfo, SignUpInfo };
