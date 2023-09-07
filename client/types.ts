export interface signupData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  // role: string;
}
export interface loginData {
  email: string;
  password: string;
}

export interface User {
  userId: string;
  role: string;
  username: string;
  email: string;
}

export interface DynamicEditorProps {
  onEditorChange: (content: string) => void;
  content: string;
}

export interface SingleBlog {
  title: string;
  thumbnail: string;
  description: string;
  user: {
    name: string;
  };
  category: {
    title: string;
  };
}

export interface userLocal {
  user: { role: string; username: string; email: string; userId: string };
}
