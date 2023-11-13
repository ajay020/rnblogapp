export type AppRootStackParamList = {
  Home: undefined;
  CreatePost: undefined;
  EditPost: { postData: PostData };
  PostDetail: { postData: PostData };
  UpdateProfile: undefined;
};

export type AuthRootStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type PostData = {
  id: string;
  title: string;
  image?: string;
  description: string;
  authorId: string; // The ID of the post's author
  author?: { email: string; name: string; photoURL?: string };
};
