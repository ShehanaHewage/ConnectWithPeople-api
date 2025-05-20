export interface User {
  userId: string;
  username: string;
  passwordHash: string;
  email: string;
  firstName: string;
  lastName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  postId: string;
  authorId: string; 
  description: string | null;
  mapsCoordinates: string | null;
  mediaUrl: string | null;
  postType: string | null;
  endingDate: Date | null;
  likesCount: number;
  sharesCount: number;
  createdAt: Date;
  updatedAt: Date;
}
